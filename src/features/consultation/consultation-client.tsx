"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { Info, Layers2, Leaf, Send, SlidersHorizontal, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PreferencesDialog } from "./preferences-dialog";
import { initialPreferences, preferenceLabels, type PreviewInterest } from "./preferences";
import { RecommendationPreview, type ResultPreviewState } from "./recommendation-preview";

type PreviewMessage = { id: number; role: "user" | "guide"; text: string };
const SUGGESTIONS = ["A lightweight foundation up to S$40", "Help me compare moisturizer textures"];

export function ConsultationClient({ interest }: { interest: PreviewInterest }) {
  const [preferences, setPreferences] = useState(() => initialPreferences(interest));
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [confirmAction, setConfirmAction] = useState<"delete" | "new" | null>(null);
  const [resultState, setResultState] = useState<ResultPreviewState>("empty");
  const [announcement, setAnnouncement] = useState("");
  const composer = useRef<HTMLTextAreaElement>(null);
  const messageNumber = useRef(0);
  const dialogReturnFocus = useRef<HTMLButtonElement | null>(null);

  function openPreferences(event: MouseEvent<HTMLButtonElement>) {
    dialogReturnFocus.current = event.currentTarget;
    setPreferencesOpen(true);
  }

  function openConfirmation(action: "new" | "delete", event: MouseEvent<HTMLButtonElement>) {
    dialogReturnFocus.current = event.currentTarget;
    setConfirmAction(action);
  }

  function restoreDialogFocus(event: Event) {
    event.preventDefault();
    dialogReturnFocus.current?.focus();
  }
  const labels = preferenceLabels(preferences);

  function submitMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || messages.length >= 40) return;
    const userId = ++messageNumber.current;
    const guideId = ++messageNumber.current;
    setMessages((current) => [...current, { id: userId, role: "user", text }, { id: guideId, role: "guide", text: "Your message has been added to this preview. The live beauty assistant isn’t connected yet. You can explore the preference controls while we prepare verified product recommendations." }]);
    setDraft("");
    setResultState("empty");
    setAnnouncement("Message added. This preview does not generate AI recommendations.");
    composer.current?.focus();
  }

  function clearConversation() {
    setMessages([]); setDraft(""); setResultState("empty");
    if (confirmAction === "new") setPreferences(initialPreferences());
    setAnnouncement(confirmAction === "new" ? "New consultation started. Preferences reset." : "Conversation deleted from this page. Your preferences are unchanged.");
    setConfirmAction(null);
    dialogReturnFocus.current = null;
    requestAnimationFrame(() => composer.current?.focus());
  }

  return <>
    <div className="consultation-workspace">
      <aside className="preferences-sidebar" aria-label="Your preferences">
        <h2>Your preferences</h2>
        <ul className="preference-list"><li><Leaf aria-hidden="true" /><span>{labels.interest}</span></li><li><Layers2 aria-hidden="true" /><span>{labels.products}</span></li><li><Sparkles aria-hidden="true" /><span>{labels.details}</span></li><li><Tag aria-hidden="true" /><span>{labels.budget}</span></li></ul>
        <Separator />
        <div className="sidebar-actions"><Button onClick={openPreferences}>Edit preferences</Button><Button variant="outline" onClick={(event) => openConfirmation("new", event)}>New consultation</Button></div>
        <div className="sidebar-save"><Separator /><div className="sidebar-actions"><Button variant="outline" asChild><Link href="/sign-in">Save conversation</Link></Button></div><p>Sign in to save across devices.<br />Account saving is coming soon.</p></div>
      </aside>
      <main id="main-content" className="chat-area">
        <div className="chat-heading"><h1>Let’s find your next favourite.</h1><p>Tell us what you love. We’ll help you explore the catalogue.</p></div>
        <p className="preview-notice"><Info size={14} aria-hidden="true" /><span>Early preview. Explore the experience; live recommendations and account saving are coming soon. This chat clears when you leave or refresh.</span></p>
        <div className="mobile-preferences"><Button variant="outline" onClick={openPreferences}><SlidersHorizontal data-icon="inline-start" />Preferences</Button><Button variant="ghost" onClick={(event) => openConfirmation("new", event)}>New consultation</Button><Button variant="ghost" asChild><Link href="/sign-in">Save</Link></Button></div>
        <div className="conversation" role="log" aria-label="Consultation messages" aria-live="off">
          {messages.length === 0 ? <div className="chat-message chat-message-guide"><span className="message-label">Your consultation</span><p>What would you like to explore? Set a few preferences, or start with a question.</p><div className="suggestion-list">{SUGGESTIONS.map((suggestion) => <Button key={suggestion} variant="outline" onClick={() => { setDraft(suggestion); composer.current?.focus(); }}>{suggestion}</Button>)}</div></div> : null}
          <AnimatePresence initial={false}>{messages.map((message) => <m.div key={message.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }} className={cn("chat-message", message.role === "user" ? "chat-message-user" : "chat-message-guide")}>{message.role === "guide" ? <span className="message-label">Preview guide</span> : <span className="sr-only">You: </span>}<p>{message.text}</p></m.div>)}</AnimatePresence>
        </div>
        <section className="results-section" aria-labelledby="recommendations-title"><Separator /><h2 id="recommendations-title" className="mt-5">Your recommendations</h2><RecommendationPreview state={resultState} onRetry={() => { setResultState("empty"); setAnnouncement("Returned to the empty catalogue preview."); }} /></section>
        <details className="preview-controls"><summary>Explore preview states</summary><div className="preview-state-buttons"><Button variant="outline" size="sm" onClick={() => setResultState("empty")}>Empty catalogue</Button><Button variant="outline" size="sm" onClick={() => setResultState("loading")}>Loading example</Button><Button variant="outline" size="sm" onClick={() => setResultState("error")}>Error example</Button></div></details>
        <div className="composer-section"><form onSubmit={submitMessage} aria-label="Send a consultation message"><div className="composer-row"><InputGroup className="composer-input"><label className="sr-only" htmlFor="message">Your message</label><InputGroupTextarea id="message" ref={composer} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about skincare or makeup…" maxLength={2000} rows={1} aria-describedby="composer-help" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} /><InputGroupAddon align="inline-end" className="p-0"><InputGroupButton variant="default" type="submit" size="icon-sm" aria-label="Send message" disabled={!draft.trim() || messages.length >= 40}><Send /></InputGroupButton></InputGroupAddon></InputGroup><Button className="composer-delete" variant="link" type="button" onClick={(event) => openConfirmation("delete", event)}>Delete conversation</Button></div><div className="composer-note" id="composer-help"><span>{messages.length >= 40 ? "Preview limit reached. Start a new consultation to continue." : "Cosmetic product discovery. Not medical advice."}</span><span>{draft.length > 1800 ? `${draft.length}/2,000 · ` : ""}Shift + Enter for a new line</span></div></form></div>
        <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      </main>
    </div>
    <PreferencesDialog onCloseAutoFocus={restoreDialogFocus} open={preferencesOpen} onOpenChange={setPreferencesOpen} value={preferences} onSave={(value) => { setPreferences(value); setResultState("empty"); setAnnouncement("Preferences updated."); }} />
    <AlertDialog open={confirmAction !== null} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}><AlertDialogContent onCloseAutoFocus={restoreDialogFocus}><AlertDialogHeader><AlertDialogTitle>{confirmAction === "new" ? "Start a new consultation?" : "Delete this conversation?"}</AlertDialogTitle><AlertDialogDescription>{confirmAction === "new" ? "This clears the messages and preferences in this unsaved preview." : "This removes the messages on this page. Your preferences will stay. This can’t be undone."}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep conversation</AlertDialogCancel><AlertDialogAction onClick={clearConversation}>{confirmAction === "new" ? "Start new" : "Delete conversation"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}
