import { createFileRoute } from "@tanstack/react-router";
import AnniversaryPage from "@/components/AnniversaryPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy 1st Anniversary — Jasmine & Sharlmon" },
      { name: "description", content: "A love letter for our first year together. June 22nd marks one beautiful year." },
      { property: "og:title", content: "Happy 1st Anniversary — Jasmine & Sharlmon" },
      { property: "og:description", content: "A love letter for our first year together." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&family=Pinyon+Script&display=swap",
      },
    ],
  }),
  component: AnniversaryPage,
});
