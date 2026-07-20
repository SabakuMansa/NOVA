import type { Metadata } from "next";
import { seo } from "@/content/site";
import V2Nav from "@/components/v2/Nav";
import V2Footer from "@/components/v2/Footer";
import SmoothScroll from "@/components/v2/SmoothScroll";

// Espace isolé de démonstration : non indexé tant qu'il n'est pas validé.
export const metadata: Metadata = {
  title: { default: "K1000 Studio", template: "%s · K1000 Studio" },
  robots: { index: false, follow: false },
  metadataBase: new URL(seo.siteUrl),
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-nappe text-cafe">
      <SmoothScroll />
      <V2Nav />
      {children}
      <V2Footer />
    </div>
  );
}
