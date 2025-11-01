import React from 'react';
import { Client } from '../types';
import { Modal } from './Modal';

interface DeleteConfirmationModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ client, isOpen, onClose, onConfirm }) => {
  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete Client`}>
        <div className="space-y-6">
            <p className="text-gray-300">
                Are you sure you want to permanently delete the client{' '}
                <strong className="text-white">{client.client_name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end pt-4 space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors"
                >
                    Confirm Delete
                </button>
            </div>
        </div>
    </Modal>
  );
};
