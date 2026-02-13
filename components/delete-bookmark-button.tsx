"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteBookmarkButton({ bookmarkId }: { bookmarkId: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bookmark?"
    );

    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId);

    setLoading(false);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      title="Delete bookmark"
    >
      <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
  );
}
