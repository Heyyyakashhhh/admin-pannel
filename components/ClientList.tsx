import React from 'react';
import { Client } from '../types';

interface ClientListItemProps {
    client: Client;
    onRenew: (client: Client) => void;
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({ client, onRenew, onEdit, onDelete }) => {
    const startDate = new Date(client.start_date);
    const endDate = new Date(client.end_date);

    // For status logic, compare dates in UTC to avoid timezone issues.
    const now = new Date();
    const todayUTCStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const endDateObj = new Date(client.end_date);

    const isExpired = endDateObj < todayUTCStart;

    const sevenDaysFromTodayUTC = new Date(todayUTCStart.getTime());
    sevenDaysFromTodayUTC.setUTCDate(sevenDaysFromTodayUTC.getUTCDate() + 7);
    
    const isExpiringSoon = !isExpired && endDateObj.getTime() <= sevenDaysFromTodayUTC.getTime();

    let statusClasses = "bg-green-500";
    if (isExpired) statusClasses = "bg-red-500";
    else if (isExpiringSoon) statusClasses = "bg-yellow-500";

    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4 hover:bg-gray-700/50 transition-colors duration-200">
            <div className="flex-1">
                <div className="flex items-center mb-2">
                     <span className={`w-3 h-3 rounded-full mr-3 ${statusClasses}`}></span>
                    <h4 className="text-xl font-bold text-white">{client.client_name}</h4>
                </div>
                <p className="text-gray-400 text-sm">Phone: <span className="font-medium text-gray-300">{client.client_phone}</span></p>
                <p className="text-gray-400 text-sm mt-1">Plan Dates: <span className="font-medium text-gray-300">{startDate.toLocaleDateString()}</span> to <span className="font-medium text-gray-300">{endDate.toLocaleDateString()}</span></p>
                <p className="text-gray-400 text-sm mt-1">Payment: <span className="font-semibold text-cyan-400">{client.payment_notes}</span></p>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
                {isExpired ? (
                    <>
                        <button 
                            onClick={() => onDelete(client)}
                            className="flex-1 md:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors text-sm font-semibold"
                        >
                            Delete
                        </button>
                        <button 
                            onClick={() => onRenew(client)}
                            className="flex-1 md:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors text-sm font-semibold"
                        >
                            Renew Plan
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => onEdit(client)}
                            className="flex-1 md:w-auto bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors text-sm font-semibold"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => onDelete(client)}
                            className="flex-1 md:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors text-sm font-semibold"
                        >
                            Delete
                        </button>
                        <button 
                            onClick={() => onRenew(client)}
                            className="flex-1 md:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors text-sm font-semibold"
                        >
                            Renew Plan
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

interface ClientListProps {
  clients: Client[];
  onRenew: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ clients, onRenew, onEdit, onDelete }) => {
  return (
    <>
      {clients.length > 0 ? (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {clients.map(client => (
            <ClientListItem key={client.id} client={client} onRenew={onRenew} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No clients found. Try a different search or add a new client.</p>
      )}
    </>
  );
};