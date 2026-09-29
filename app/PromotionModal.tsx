"use client";

import { useEffect, useState } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";

type PromotionStep = { from: string; to: string; count: number; graduating: boolean };

type PromotionPreview = {
    year: number;
    alreadyPromoted: { promotedCount: number; graduatedCount: number; createdAt: string } | null;
    steps: PromotionStep[];
    promotedCount: number;
    graduatingCount: number;
    newClasses: string[];
    duplicates: string[];
    untouched: { name: string; count: number }[];
};

type PromotionResult = { year: number; promotedCount: number; graduatedCount: number; createdClasses: string[] };

interface PromotionModalProps {
    schoolId: string;
    schoolName: string;
    onClose: () => void;
    onPromoted: () => void;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Preview + confirmation for the yearly promotion of one school (see /api/promotions)
export default function PromotionModal({ schoolId, schoolName, onClose, onPromoted }: PromotionModalProps) {
    const [preview, setPreview] = useState<PromotionPreview | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [promoting, setPromoting] = useState(false);
    const [result, setResult] = useState<PromotionResult | null>(null);

    useEffect(() => {
        async function loadPreview() {
            try {
                const res = await fetch(`/api/promotions?schoolId=${schoolId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to load preview");
                setPreview(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load preview");
            }
        }
        loadPreview();
    }, [schoolId]);

    const promote = async () => {
        if (!preview || promoting) return;
        setPromoting(true);
        setError(null);

        try {
            const res = await fetch("/api/promotions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schoolId, year: preview.year }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Promotion failed");
            setResult(data);
            onPromoted();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Promotion failed");
        } finally {
            setPromoting(false);
        }
    };

    const total = preview ? preview.promotedCount + preview.graduatingCount : 0;
    const canPromote = !!preview && !preview.alreadyPromoted && preview.duplicates.length === 0 && total > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] max-w-lg w-full max-h-[90vh] overflow-y-auto relative p-6">
                <button
                    onClick={onClose}
                    disabled={promoting}
                    className="absolute top-4 right-4 text-[#EAEAEA] hover:text-white text-3xl leading-none disabled:opacity-30"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-[#F1F1F1] pr-8">Start New School Year</h2>
                <p className="text-[#888] text-sm mt-1 mb-6">{schoolName}</p>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-[#451A1A] text-[#ff4d4f]" role="alert">
                        {error}
                    </div>
                )}

                {result ? (
                    <>
                        <div className="mb-6 p-4 rounded-lg bg-[#1B5E20] text-[#4CAF50]">
                            ✅ Promoted {plural(result.promotedCount, "student")} and graduated{" "}
                            {plural(result.graduatedCount, "student")} into the {result.year} group.
                            {result.createdClasses.length > 0 && ` Created: ${result.createdClasses.join(", ")}.`}
                        </div>
                        <ShinyButton onClick={onClose} className="w-full py-2.5">
                            Done
                        </ShinyButton>
                    </>
                ) : !preview ? (
                    !error && <div className="text-[#EAEAEA] py-8 text-center">Loading preview...</div>
                ) : preview.alreadyPromoted ? (
                    <>
                        <div className="mb-6 p-4 rounded-lg bg-[#121212] border border-[#2D2D2D] text-[#EAEAEA]">
                            This school was already promoted for {preview.year} on{" "}
                            {new Date(preview.alreadyPromoted.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            : {plural(preview.alreadyPromoted.promotedCount, "student")} promoted,{" "}
                            {plural(preview.alreadyPromoted.graduatedCount, "student")} graduated. The next promotion can run in {preview.year + 1}.
                        </div>
                        <ShinyButton onClick={onClose} variant="secondary" className="w-full py-2.5">
                            Close
                        </ShinyButton>
                    </>
                ) : (
                    <>
                        <div className="space-y-2 mb-4">
                            {preview.steps.map((step) => (
                                <div
                                    key={step.from}
                                    className={`flex justify-between gap-4 px-4 py-2 rounded-lg bg-[#121212] border border-[#2D2D2D] ${step.count === 0 ? "opacity-50" : ""}`}
                                >
                                    <span className="text-[#F1F1F1]">
                                        {step.from} → {step.to}
                                        {step.graduating && <span className="text-[#888]"> (graduated)</span>}
                                    </span>
                                    <span className="text-[#EAEAEA] font-semibold whitespace-nowrap">{plural(step.count, "student")}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-[#EAEAEA] space-y-2 mb-6">
                            {total === 0 && <p>There are no students to promote.</p>}
                            {preview.newClasses.length > 0 && (
                                <p>New classes will be created: {preview.newClasses.join(", ")}.</p>
                            )}
                            {preview.untouched.length > 0 && (
                                <p>
                                    Not moved (not a standard class):{" "}
                                    {preview.untouched.map((c) => `${c.name} (${c.count})`).join(", ")}.
                                </p>
                            )}
                            {preview.duplicates.length > 0 && (
                                <p className="text-[#ff4d4f]">
                                    This school has more than one {preview.duplicates.join(", ")} class. Merge them before promoting.
                                </p>
                            )}
                            <p className="text-[#888]">
                                Graduates leave the current student list but keep their profile and full attendance history
                                under Graduated Students. Past attendance is not changed. Teachers Attendance is not affected.
                            </p>
                        </div>

                        {canPromote ? (
                            <>
                                <label className="flex items-start gap-3 text-sm text-[#EAEAEA] mb-6 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                        className="mt-1"
                                    />
                                    <span>
                                        I understand this moves all {plural(total, "student")} in {schoolName} up one class,
                                        can only run once for {preview.year}, and can&apos;t be undone from the app.
                                    </span>
                                </label>
                                <div className="flex gap-3">
                                    <ShinyButton onClick={onClose} variant="secondary" disabled={promoting} className="flex-1 py-2.5">
                                        Cancel
                                    </ShinyButton>
                                    <ShinyButton
                                        onClick={promote}
                                        variant="red"
                                        disabled={!confirmed || promoting}
                                        className="flex-1 py-2.5 disabled:opacity-50"
                                    >
                                        {promoting ? "Promoting..." : `Promote ${plural(total, "Student")}`}
                                    </ShinyButton>
                                </div>
                            </>
                        ) : (
                            <ShinyButton onClick={onClose} variant="secondary" className="w-full py-2.5">
                                Close
                            </ShinyButton>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
