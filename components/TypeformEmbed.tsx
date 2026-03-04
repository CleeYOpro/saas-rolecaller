"use client"

import { Widget } from "@typeform/embed-react";

interface TypeformEmbedProps {
  formId: string;
  className?: string;
}

export default function TypeformEmbed({ formId, className }: TypeformEmbedProps) {
  return (
    <div style={{ height: "calc(100vh - 64px)", width: "100%" }} className="w-full">
      <Widget
        id={formId}
        style={{ width: "100%", height: "100%" }}
        className={className || "my-form"}
      />
    </div>
  );
}