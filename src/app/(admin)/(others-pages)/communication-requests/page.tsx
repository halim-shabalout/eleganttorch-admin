import type { Metadata } from "next";
import { CommunicationRequestsComponent } from "@/components/communication-requests/CommunicationRequestsComponent";

export const metadata: Metadata = {
  title: "elegantTorch Admin - Communication Requests",
  description: "ElegantTorch Admin - Communication Requests",
};

export default function CommunicationRequests() {
  return (
    <>
        <CommunicationRequestsComponent />
    </>
  );
}
