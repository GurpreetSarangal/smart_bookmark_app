import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { Suspense } from "react";
import { AddBookmarkModal } from "@/components/add-bookmark-modal";
import { BookmarkList } from "@/components/bookmark-list";

async function UserDetails() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
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
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 relative">
      <div className="bg-accent p-3 rounded flex gap-2 items-center">
        <InfoIcon size={16} />
        Authenticated page
      </div>

      <Suspense fallback="Loading user…">
        <UserDetails />
      </Suspense>

      <div>
        <h3 className="font-semibold text-lg mb-2">Your bookmarks</h3>
        <BookmarkList />
      </div>

      {/* ➕ Add bookmark */}
      <AddBookmarkModal />
    </div>
  );
}
