import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function openPreferences(page: Page, mobile: boolean) {
  const trigger = page.getByRole("button", { name: mobile ? "Preferences" : "Edit preferences", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Your preferences" })).toBeVisible();
  return trigger;
}

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => { throw error; });
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("404 (Not Found)")) {
      throw new Error(`Browser console: ${message.text()}`);
    }
  });
});

test("landing navigates to the consultation and loads its original artwork", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Till Dawn/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Skincare &makeup.");
  await expect(page.locator(".hero-art")).toBeVisible();
  await expect.poll(() => page.locator(".hero-art").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expectNoOverflow(page);
  await expectAccessible(page);
  await page.getByRole("link", { name: "Start a consultation" }).click();
  await expect(page).toHaveURL(/\/consultation$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Consultation");
  await expect(page.getByText("Preview only.", { exact: false })).toBeVisible();
  await expect(page.locator(".preview-controls")).toHaveCount(0);
});

test("preferences branch, apply, cancel, and omit an inapplicable finish", async ({ page, isMobile }) => {
  await page.goto("/consultation");
  let trigger = await openPreferences(page, isMobile);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Makeup", exact: true }).click();
  await dialog.getByRole("radio", { name: "Foundation", exact: true }).click();
  await dialog.getByRole("radio", { name: "Natural", exact: true }).click();
  await dialog.getByLabel("Budget per product").fill("40");
  await expectAccessible(page);
  await dialog.getByRole("button", { name: "Apply preferences" }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  trigger = await openPreferences(page, isMobile);
  await expect(dialog.getByLabel("Budget per product")).toHaveValue("40");
  await dialog.getByLabel("Budget per product").fill("99");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(trigger).toBeFocused();
  await openPreferences(page, isMobile);
  await expect(dialog.getByLabel("Budget per product")).toHaveValue("40");
  await dialog.getByRole("radio", { name: "Mascara", exact: true }).click();
  await expect(dialog.getByRole("radio", { name: "Natural", exact: true })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Apply preferences" }).click();
  await openPreferences(page, isMobile);
  await dialog.getByRole("radio", { name: "Foundation", exact: true }).click();
  await expect(dialog.getByRole("radio", { name: "Natural", exact: true })).toHaveAttribute("aria-checked", "false");
  await dialog.getByRole("radio", { name: "Both", exact: true }).click();
  await expect(dialog.getByRole("radio", { name: "Moisturizer", exact: true })).toBeVisible();
  await dialog.getByRole("radio", { name: "Just exploring", exact: true }).click();
  await expect(dialog.getByRole("radio", { name: "Moisturizer", exact: true })).toHaveCount(0);
});

test("chat uses page memory, handles multiline text, and confirms clearing", async ({ page, isMobile }) => {
  await page.goto("/consultation?interest=skincare");
  const message = page.getByRole("textbox", { name: "Your message" });
  const send = page.getByRole("button", { name: "Send message", exact: true });
  await expect(send).toBeDisabled();
  await message.fill("  ");
  await expect(send).toBeDisabled();
  await message.fill("<b>Lightweight moisturizer</b>");
  await message.press("Shift+Enter");
  await message.press("End");
  await message.press("A");
  await send.click();
  const log = page.getByRole("log", { name: "Consultation messages" });
  await expect(log).toContainText("<b>Lightweight moisturizer</b>");
  await expect(log.locator("b")).toHaveCount(0);
  await expect(log).toContainText("The live beauty assistant isn’t connected yet");
  await expect(message).toHaveValue("");
  const deleteButton = page.getByRole("button", { name: "Delete conversation", exact: true });
  await deleteButton.click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Keep conversation" }).click();
  await expect(deleteButton).toBeFocused();
  await expect(log).toContainText("Lightweight moisturizer");
  await deleteButton.click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete conversation" }).click();
  await expect(log).not.toContainText("Lightweight moisturizer");
  await expect(message).toBeFocused();
  await openPreferences(page, isMobile);
  await expect(page.getByRole("dialog").getByRole("radio", { name: "Skincare", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "New consultation", exact: true }).filter({ visible: true }).click();
  await page.getByRole("button", { name: "Start new", exact: true }).click();
  await openPreferences(page, isMobile);
  await expect(page.getByRole("dialog").getByRole("radio", { name: "Just exploring", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await message.fill("Session only");
  await message.press("Enter");
  await expect(log).toContainText("Session only");
  await page.reload();
  await expect(log).not.toContainText("Session only");
});

test("loading and error examples recover to an honest empty catalogue", async ({ page }) => {
  await page.goto("/consultation?preview=1");
  await expectAccessible(page);
  await page.getByText("Preview states", { exact: true }).click();
  await page.getByRole("button", { name: "Loading example" }).click();
  await expect(page.getByRole("status", { name: "Example loading state" })).toBeVisible();
  await page.getByRole("button", { name: "Error example" }).click();
  await expect(page.getByRole("region", { name: "Recommendations" }).getByRole("alert")).toContainText("We couldn’t load your recommendations");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No products yet." })).toBeVisible();
  await expectNoOverflow(page);
});

test("catalogue and account destinations do not imply saved data", async ({ page, isMobile }) => {
  await page.goto("/products?category=makeup");
  const categories = page.getByRole("navigation", { name: "Product categories" });
  await expect(categories.getByRole("link", { name: "Makeup" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "No products yet." })).toBeVisible();
  await expectAccessible(page);
  await page.getByRole("link", { name: "Start a consultation" }).click();
  await expect(page).toHaveURL(/interest=makeup/);
  await page.getByRole("link", { name: isMobile ? "Save" : "Save conversation", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("main")).toContainText("aren’t available yet");
  await expect(page.getByRole("textbox")).toHaveCount(0);
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "History", exact: true }).click();
  } else {
    await page.getByRole("link", { name: "Till Dawn home", exact: true }).first().click();
    await page.getByRole("link", { name: "Start a consultation" }).click();
    await page.getByRole("link", { name: "History", exact: true }).click();
  }
  await expect(page).toHaveURL(/\/account\/history$/);
  await expect(page.getByRole("main")).toContainText("history");
});

test("mobile menu navigates and narrow layouts do not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await expectNoOverflow(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Consultation", exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/consultation$/);
  await expectNoOverflow(page);
  await openPreferences(page, true);
  await page.getByRole("dialog").getByRole("radio", { name: "Both", exact: true }).click();
  await expectNoOverflow(page);
});
