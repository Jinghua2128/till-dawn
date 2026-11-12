"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FINISHES, INTERESTS, isPreviewInterest, MAKEUP_TYPES, SKINCARE_TYPES, SKIN_TYPES, type PreviewPreferences } from "./preferences";

function ChoiceField({ label, id, options, value, onChange }: { label: string; id: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <FieldSet><FieldLegend id={id} variant="label">{label}</FieldLegend><ToggleGroup className="preference-choices" type="single" aria-labelledby={id} value={value} onValueChange={onChange}>{options.map((option) => <ToggleGroupItem key={option} value={option}>{option}</ToggleGroupItem>)}</ToggleGroup></FieldSet>;
}

function PreferencesForm({ value, onSave, onCancel }: { value: PreviewPreferences; onSave: (value: PreviewPreferences) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(value);
  const skincare = draft.interest === "skincare" || draft.interest === "both";
  const makeup = draft.interest === "makeup" || draft.interest === "both";
  function setField(field: keyof PreviewPreferences, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }
  return <form className="preferences-form" onSubmit={(event) => {
    event.preventDefault();
    onSave({ ...draft, skincareType: skincare ? draft.skincareType : "", skinType: skincare ? draft.skinType : "", makeupType: makeup ? draft.makeupType : "", finish: makeup && !["Mascara", "Eye makeup"].includes(draft.makeupType) ? draft.finish : "" });
  }}>
    <FieldGroup>
      <FieldSet><FieldLegend id="interest-label" variant="label">Category</FieldLegend>
        <ToggleGroup type="single" className="preference-choices" aria-labelledby="interest-label" value={draft.interest} onValueChange={(value) => { if (isPreviewInterest(value)) setField("interest", value); }}>
          {INTERESTS.map(({ value, label }) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
        </ToggleGroup>
      </FieldSet>
      {skincare ? <><ChoiceField id="skincare-type-label" label="Skincare products" options={SKINCARE_TYPES} value={draft.skincareType} onChange={(value) => setField("skincareType", value)} /><ChoiceField id="skin-type-label" label="Skin type" options={SKIN_TYPES} value={draft.skinType} onChange={(value) => setField("skinType", value)} /></> : null}
      {makeup ? <><ChoiceField id="makeup-type-label" label="Makeup products" options={MAKEUP_TYPES} value={draft.makeupType} onChange={(value) => setField("makeupType", value)} />{!['Mascara', 'Eye makeup'].includes(draft.makeupType) ? <ChoiceField id="finish-label" label="Finish" options={FINISHES} value={draft.finish} onChange={(value) => setField("finish", value)} /> : null}</> : null}
      <Field><FieldLabel htmlFor="budget">Budget per product</FieldLabel><div className="preference-budget"><span aria-hidden="true">S$</span><Input id="budget" aria-describedby="budget-description" inputMode="decimal" type="number" min="0" max="10000" step="0.01" value={draft.budget} onChange={(event) => setField("budget", event.target.value)} /></div><FieldDescription id="budget-description">Excludes delivery.</FieldDescription></Field>
    </FieldGroup>
    <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">Apply preferences</Button></DialogFooter>
  </form>;
}

export function PreferencesDialog({ open, onOpenChange, value, onSave, onCloseAutoFocus }: { open: boolean; onOpenChange: (open: boolean) => void; value: PreviewPreferences; onSave: (value: PreviewPreferences) => void; onCloseAutoFocus: (event: Event) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent onCloseAutoFocus={onCloseAutoFocus} className="max-h-[88dvh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>Your preferences</DialogTitle><DialogDescription className="sr-only">All fields are optional.</DialogDescription></DialogHeader><PreferencesForm key={open ? "open" : "closed"} value={value} onCancel={() => onOpenChange(false)} onSave={(preferences) => { onSave(preferences); onOpenChange(false); }} /></DialogContent></Dialog>;
}
