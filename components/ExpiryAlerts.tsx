import React from 'react';
import { Client, Owner } from '../types';

interface ExpiryAlertsProps {
  clients: Client[];
  owner: Owner;
}

export const ExpiryAlerts: React.FC<ExpiryAlertsProps> = ({ clients, owner }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const expiringClients = clients.filter(c => c.end_date.startsWith(tomorrowStr));

  if (expiringClients.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-yellow-500/30">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4">Plan Expiry Alerts (for tomorrow)</h3>
      <div className="space-y-6">
        {expiringClients.map(client => (
          <div key={client.id} className="p-4 bg-gray-900/50 rounded-md border-l-4 border-yellow-500">
            <p className="font-semibold text-lg text-white mb-2">{client.client_name}</p>
            <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-gray-700/50 p-3 rounded">
                    <p className="font-mono text-xs text-yellow-300">[OWNER SMS SIMULATION]</p>
                    <p>ALERT: Client {client.client_name} (Phone: {client.client_phone}) plan expires tomorrow. Contact for renewal.</p>
                </div>
                 <div className="bg-gray-700/50 p-3 rounded">
                    <p className="font-mono text-xs text-cyan-300">[CLIENT SMS SIMULATION]</p>
                    <p>Dear {client.client_name}, your 'The Extreme Gym' plan expires tomorrow. Please contact the owner at {owner.owner_phone} for renewal.</p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};