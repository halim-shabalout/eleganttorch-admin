import React, { use, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import { useLocale } from '@/context/LocaleContext';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types/User';

interface Props {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}


const DeleteUserModal: React.FC<Props> = ({ user, isOpen, onClose, onSuccess }) => {
  const { messages} = useLocale();
  const { remove, removing } = useUsers();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const success = await remove(user._id);
      if (success) {
        onClose()
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className='pt-4 pb-4 text-center'>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {messages["confirm_delete"] || "Confirm Deletion"}
        </h4>

        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          {(messages["delete_warning"] ||
            `Are you sure you want to delete "${user?.name ?? ""}"? This action cannot be undone.`)
            .replace("{name}", user?.name ?? "")}
        </p>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}

      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          {messages["cancel"] || "Cancel"}
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={removing}
          onClick={handleDelete}
        >
          {removing
            ? messages["deleting"] || "Deleting..."
            : messages["delete"] || "Delete"}
        </Button>
      </div>
    </Modal>
  );

};

export default DeleteUserModal;
