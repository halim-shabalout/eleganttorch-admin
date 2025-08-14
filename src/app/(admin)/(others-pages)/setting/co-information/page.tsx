import CoInformationComponent from "@/components/setting/co-information/CoInformationComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "elegantTorch Admin - Contact Information",
  description: "ElegantTorch Admin - Manage your contact information easily.",
};
export default function CoInformation() {
  return (
    <>
      <CoInformationComponent />
    </>
  );
}
