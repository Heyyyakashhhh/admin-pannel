
import React, { useState, useEffect } from 'react';
import { Owner } from '../types';

interface SettingsViewProps {
  owner: Owner;
  onSave: (owner: Owner) => void;
}

const BackendSetupGuide = () => (
    <div className="bg-gray-900/50 p-6 rounded-lg mt-10 border border-cyan-500/30">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Backend & SMS Setup Guide (for Full-Stack Implementation)</h3>
        <p className="text-gray-400 mb-4">This is a frontend-only demonstration. To send real SMS notifications, you need a backend with Firebase Cloud Functions and Twilio. Here are the steps:</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>
                <strong>Setup Firebase:</strong> Create a Firebase project and set up Firestore. Use the data structure from `types.ts` to create `owners` and `clients` collections.
            </li>
            <li>
                <strong>Setup Twilio:</strong> Create a Twilio account, get your Account SID, Auth Token, and a Twilio phone number.
            </li>
            <li>
                <strong>Configure Firebase Environment:</strong> Securely store your Twilio credentials in Firebase Functions environment configuration. Open your terminal and run:
                <code className="block bg-gray-800 text-yellow-300 p-3 rounded-md my-2 text-sm">
                    firebase functions:config:set twilio.sid="YOUR_SID" twilio.token="YOUR_TOKEN" twilio.number="YOUR_TWILIO_NUMBER"
                </code>
            </li>
            <li>
                <strong>Deploy Cloud Functions:</strong> Write and deploy two Node.js functions:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                    <li>A daily scheduled function (`checkExpiryAndNotify`) to query clients and send SMS alerts via Twilio.</li>
                    <li>An HTTPS callable function (`renewClientPlan`) to securely handle plan renewals from the app.</li>
                </ul>
            </li>
             <li>
                <strong>Connect Frontend:</strong> Replace the mock data and logic in this React app with calls to your live Firebase backend.
            </li>
        </ol>
    </div>
)

export const SettingsView: React.FC<SettingsViewProps> = ({ owner, onSave }) => {
  const [formData, setFormData] = useState<Owner>(owner);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(owner);
  }, [owner]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl font-semibold text-cyan-400">Owner Details</h3>
        <p className="text-sm text-gray-400 -mt-4">This phone number will be used for owner SMS notifications.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Owner Name" name="owner_name" value={formData.owner_name} onChange={handleInputChange} />
          <InputField label="Owner Phone" name="owner_phone" type="tel" value={formData.owner_phone} onChange={handleInputChange} />
          <InputField label="Owner Email" name="owner_email" type="email" value={formData.owner_email} onChange={handleInputChange} />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-500 transition-colors font-semibold relative"
          >
            {isSaved ? "Saved!" : "Save Owner Details"}
          </button>
        </div>
      </form>
      <BackendSetupGuide />
    </div>
  );
};

const InputField: React.FC<{label: string, name: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, name, type = "text", value, onChange}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
    </div>
);
   