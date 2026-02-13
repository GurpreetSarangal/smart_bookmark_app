"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "success" | "error";

export function AddBookmarkModal() {
    const supabase = createClient();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleAdd() {
        if (!title || !url) return;

        setLoading(true);
        setStatus("idle");
        setErrorMessage(null);

        // 1. Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setStatus("error");
            setErrorMessage("You must be logged in");
            setLoading(false);
            return;
        }

        // 2. Insert with user_id
        const { error } = await supabase.from("bookmarks").insert({
            title,
            url,
            user_id: user.id,
        });

        setLoading(false);

        if (error) {
            setStatus("error");
            setErrorMessage(error.message);
            return;
        }

        setStatus("success");
        setTitle("");
        setUrl("");

        setTimeout(() => {
            setOpen(false);
            setStatus("idle");
        }, 800);
    }


    return (
        <>
            {/* Floating + button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
                <Plus />
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Modal card */}
                    <div
                        className="
              relative z-10 w-full max-w-sm rounded-xl bg-background p-6 shadow-xl
              animate-in fade-in zoom-in-95
            "
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                            disabled={loading}
                        >
                            <X size={18} />
                        </button>

                        <h3 className="text-lg font-semibold mb-4">
                            Add new bookmark
                        </h3>

                        <div className="flex flex-col gap-3">
                            <Input
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                            <Input
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                            />

                            <Button onClick={handleAdd} disabled={loading}>
                                {loading ? "Saving..." : "Add bookmark"}
                            </Button>

                            {/* Feedback */}
                            {status === "success" && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle size={16} />
                                    Bookmark saved successfully
                                </div>
                            )}

                            {status === "error" && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errorMessage ?? "Failed to save bookmark"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
