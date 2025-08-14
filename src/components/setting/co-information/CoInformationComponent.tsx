"use client";
import { useModal } from "@/hooks/useModal";
import { useLocale } from "@/context/LocaleContext";
import { useCoInformations } from "@/hooks/useCoInformations";
import { EditCoInformationModal } from "./EditCoInformationModal";
import { CoInformation } from "@/types/CoInformation";
import React from "react";
import Button from "@/components/ui/button/Button";

// --- أيقونات مخصصة ---
// هذا المكون يعرض أيقونة مناسبة بناءً على نوع الحقل
const FieldIcon = ({ field }: { field: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    email: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    address: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
    instagram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    twitter: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
    youtube: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
    tikTok: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
  return <div className="text-blue-500 dark:text-blue-400">{icons[field] || null}</div>;
};

const InfoField = ({ label, value, fieldKey }: { label: string; value?: string; fieldKey: string }) => (
  <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-md">
    <div className="flex-shrink-0 w-8 h-8 mt-1">
      <FieldIcon field={fieldKey} />
    </div>
    <div className="flex-grow">
      <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</h5>
      <p className="text-lg font-medium text-gray-900 dark:text-white/95 leading-relaxed break-words">{value || <span className="text-gray-400 dark:text-gray-500 italic">غير متوفر</span>}</p>
    </div>
  </div>
);

// --- أيقونة التعديل ---
const EditIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" /></svg>
);

export default function CoInformationCard() {
  const { messages } = useLocale();
  const { isOpen, openModal, closeModal } = useModal();
  const { coInformations, loading, error, refetch } = useCoInformations();

  const handleSave = () => {
    closeModal();
    refetch();
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-blue-400 text-xl">جاري التحميل...</div>;
  if (error || !coInformations || coInformations.length === 0) return <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-xl">لم يتم العثور على بيانات.</div>;

  const info: CoInformation = coInformations[0];
  const fields = [
    { key: "phone", label: messages["phone"] || "Phone" },
    { key: "email", label: messages["email"] || "Email" },
    { key: "address", label: messages["address"] || "Address" },
    { key: "facebook", label: messages["facebook"] || "Facebook" },
    { key: "instagram", label: messages["instagram"] || "Instagram" },
    { key: "twitter", label: messages["twitter"] || "Twitter" },
    { key: "tikTok", label: messages["tikTok"] || "TikTok" },
    { key: "youtube", label: messages["youtube"] || "YouTube" },
  ];

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {messages["contact_information"] || "Contact Information"}
      </h3>
      <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white"></h4>
       <Button
                size="sm"
                onClick={openModal}
              >
                <EditIcon />
                {messages["u_edit"] || "Edit"}
              </Button>
        </div>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map(field => (
              <InfoField
                key={field.key}
                label={field.label}
                value={(info as any)[field.key]}
                fieldKey={field.key}
              />
            ))}
          </main>

        <EditCoInformationModal
          isOpen={isOpen}
          onClose={closeModal}
          handleSave={handleSave}
          data={info}
        />
      </div>
    </>
  );
}
