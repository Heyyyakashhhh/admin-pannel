import React from 'react';
import { Modal } from './Modal';
import { InformationCircleIcon } from './Icons';

interface WelcomeModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onGoToSettings: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onContinue, onGoToSettings }) => {
  return (
    <Modal isOpen={isOpen} onClose={onContinue} title="Welcome to The Extreme Gym Demo">
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
            <InformationCircleIcon className="w-10 h-10 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
                <p className="text-lg text-gray-200">
                    This is a frontend-only demonstration. All data is saved in your browser's local storage.
                </p>
                <p className="mt-2 text-gray-400">
                    This means the client list will be empty on any other device or browser. To sync data everywhere, you'll need to set up a free backend database.
                </p>
            </div>
        </div>
        
        <div className="bg-gray-900/50 p-4 rounded-md">
            <h4 className="font-semibold text-white">What's Next?</h4>
            <p className="text-sm text-gray-300 mt-1">
                You can either continue using the demo with local data or view the guide to set up a permanent, cross-device solution using Firebase.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end pt-4 space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={onGoToSettings}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors w-full sm:w-auto"
          >
            View Backend Setup Guide
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors w-full sm:w-auto"
          >
            Continue with Demo
          </button>
        </div>
      </div>
    </Modal>
  );
};