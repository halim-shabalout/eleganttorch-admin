import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { CoInformation } from "@/types/CoInformation";
import { useLocale } from "@/context/LocaleContext";
import { useCoInformations } from "@/hooks/useCoInformations";

interface EditCoInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  data: CoInformation;
}

export const EditCoInformationModal = ({
  isOpen,
  onClose,
  handleSave,
  data,
}: EditCoInformationModalProps) => {
  const { messages } = useLocale();
  const { update, updating, error } = useCoInformations();

  const [form, setForm] = useState<Omit<CoInformation, "_id" | "createdAt" | "updatedAt">>({
    phone: "",
    address: "",
    email: "",
    tikTok: "",
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setForm({
        phone: data.phone || "",
        address: data.address || "",
        email: data.email || "",
        tikTok: data.tikTok || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        youtube: data.youtube || "",
        twitter: data.twitter || "",
      });
    }
  }, [data]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await update(data._id, form);
    if (result) {
      setSuccessMessage(messages["updated_successfully"] || "Updated successfully");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        handleSave();
      }, 500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 px-2 pr-8">
          {messages["edit_contact_info"] || "Edit Contact Information"}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {messages["edit_contact_info_desc"] || "Update the displayed contact and social information."}
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize text-sm font-medium text-gray-800 dark:text-white/80">
                  {messages[key] || key}
                </Label>
                <Input
                  className="w-full"
                  value={value}
                  onChange={(e) => handleChange(key as keyof typeof form, e.target.value)}
                  placeholder={messages[`${key}_placeholder`] || `Enter ${key}`}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {successMessage && (
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          )}

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              {messages["cancel"] || "Cancel"}
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={updating}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {updating
                ? messages["submitting"] || "Submitting..."
                : messages["save"] || "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
