import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Shared chrome for the partners page and the blog. The home page (/) has its own nav and footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
