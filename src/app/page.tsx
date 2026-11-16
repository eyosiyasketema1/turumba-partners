import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeLanding from "@/components/home/HomeLanding";
import "./home.css";

export const metadata: Metadata = {
  title: "Turumba — One platform to message, automate, and engage",
  description:
    "Digital infrastructure for Kingdom collaboration. One inbox, one contact record, one history — across every channel your team already uses, powered by AI.",
};

export default function Home() {
  return (
    <>
      {/* the same navbar as the partners page and blog */}
      <Navbar />
      <HomeLanding />
      {/* the same footer as the partners page and blog */}
      <Footer />
    </>
  );
}
