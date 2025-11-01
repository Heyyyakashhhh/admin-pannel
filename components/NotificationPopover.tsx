import React from 'react';
import { Client } from '../types';

interface NotificationPopoverProps {
  expiringClients: Client[];
  isOpen: boolean;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ expiringClients, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 text-white animate-fade-in-up">
      <div className="p-4 border-b border-gray-700">
        <h4 className="font-semibold text-lg">Notifications</h4>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {expiringClients.length > 0 ? (
          <ul>
            {expiringClients.map(client => (
              <li key={client.id} className="p-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                <p className="font-semibold text-white">{client.client_name}</p>
                <p className="text-sm text-gray-400">
                  Plan expires on {new Date(client.end_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-gray-400">No new notifications.</p>
        )}
      </div>
    </div>
  );
};
