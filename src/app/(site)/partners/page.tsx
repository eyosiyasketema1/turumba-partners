import type { Metadata } from "next";
import WaitingListPage from "@/components/partners/WaitingListPage";

export const metadata: Metadata = {
  title: "Be a partner — Join the Turumba waiting list",
  description: "An invitation to build together: join the Turumba waiting list and help shape digital infrastructure for Kingdom collaboration.",
};

export default function PartnersPage() {
  return <WaitingListPage />;
}
