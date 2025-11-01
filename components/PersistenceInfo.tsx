import React from 'react';
import { InformationCircleIcon, CloseIcon } from './Icons';

interface PersistenceInfoProps {
  onDismiss: () => void;
}

export const PersistenceInfo: React.FC<PersistenceInfoProps> = ({ onDismiss }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900/95 backdrop-blur-sm text-white p-4 z-50 flex items-center justify-center shadow-lg animate-fade-in-up">
      <div className="flex items-center space-x-4 max-w-4xl">
        <InformationCircleIcon className="w-8 h-8 text-blue-300 flex-shrink-0" />
        <p className="text-sm">
          <strong>Data is Stored Locally:</strong> Your data is saved only in this browser and will not appear on other devices. For cross-device sync, a backend must be configured via the Settings page.
        </p>
        <button
          onClick={onDismiss}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss message"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};