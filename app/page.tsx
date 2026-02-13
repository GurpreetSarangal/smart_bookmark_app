import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in → login page
  if (!user) {
    redirect("/auth/login");
  }

  // If logged in → protected area
  redirect("/protected");
}
