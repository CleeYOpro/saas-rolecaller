"use client"

import TypeformEmbed from "@/components/TypeformEmbed";
import { Navigation } from "@/components/navigation";

export default function FormPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <div className="flex-grow">
        <TypeformEmbed formId="QnwZYU1V" />
      </div>
    </div>
  );
}