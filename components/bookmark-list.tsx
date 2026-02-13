"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DeleteBookmarkButton } from "@/components/delete-bookmark-button";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export function BookmarkList() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch bookmarks
  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("id, title, url, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchBookmarks();

    // 2️⃣ Realtime subscription
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        () => {
          // simplest + safest strategy
          console.log("this is executed");
          fetchBookmarks();
        }
      )
      .subscribe();

    // 3️⃣ Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  });

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading bookmarks…</p>;
  }

  if (bookmarks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No bookmarks yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="border rounded p-3 flex justify-between items-center"
        >
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {b.title}
          </a>

          <DeleteBookmarkButton bookmarkId={b.id} />
        </li>
      ))}
    </ul>
  );
}
