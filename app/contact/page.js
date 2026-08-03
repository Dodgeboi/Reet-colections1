import { redirect } from "next/navigation";

// Inquiries now live on their own page — old links and bookmarks still work.
export default function ContactPage() {
  redirect("/inquiry");
}
