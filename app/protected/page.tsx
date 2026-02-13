import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { Suspense } from "react";
import { AddBookmarkModal } from "@/components/add-bookmark-modal";
import { DeleteBookmarkButton } from "@/components/delete-bookmark-button";

async function UserDetailsAndBookmarks() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <pre className="text-xs font-mono p-3 rounded border">
        {JSON.stringify(
          {
            id: user.id,
            email: user.email,
          },
          null,
          2
        )}
      </pre>

      <div>
        <h3 className="font-semibold text-lg mb-2">Your bookmarks</h3>

        {bookmarks?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No bookmarks yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {bookmarks?.map((b) => (
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

                {/* 🗑 Delete */}
                <DeleteBookmarkButton bookmarkId={b.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 relative">
      <div className="bg-accent p-3 rounded flex gap-2 items-center">
        <InfoIcon size={16} />
        Authenticated page
      </div>

      <Suspense fallback="Loading...">
        <UserDetailsAndBookmarks />
      </Suspense>

      {/* ➕ Add bookmark UI */}
      <AddBookmarkModal />
    </div>
  );
}
