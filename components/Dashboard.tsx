import React from 'react';
import { Client } from '../types';
import { ClientList } from './ClientList';
import { SearchIcon } from './Icons';

interface DashboardProps {
  activeClients: Client[];
  expiredClients: Client[];
  onRenewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  expiringSoonCount: number;
  totalRevenue: number;
  expiredRevenue: number;
  grandTotalRevenue: number;
  activeClientsCount: number;
  expiredClientsCount: number;
  activeSearchQuery: string;
  onActiveSearchChange: (query: string) => void;
  expiredSearchQuery: string;
  onExpiredSearchChange: (query: string) => void;
}

const StatCard: React.FC<{title: string, value: string | number, color: string, isCurrency?: boolean}> = ({ title, value, color, isCurrency = false }) => (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${color}`}>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">
          {isCurrency ? `₹${Number(value).toLocaleString('en-IN')}` : value}
        </p>
    </div>
)

export const Dashboard: React.FC<DashboardProps> = ({ 
    activeClients,
    expiredClients,
    onRenewClient, 
    onEditClient, 
    onDeleteClient, 
    expiringSoonCount,
    totalRevenue,
    expiredRevenue,
    grandTotalRevenue,
    activeClientsCount,
    expiredClientsCount,
    activeSearchQuery,
    onActiveSearchChange,
    expiredSearchQuery,
    onExpiredSearchChange
}) => {

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Active Memberships" value={activeClientsCount} color="border-green-500" />
        <StatCard title="Expired Memberships" value={expiredClientsCount} color="border-red-500" />
        <StatCard title="Expiring Soon (Next 7d)" value={expiringSoonCount} color="border-yellow-500" />
        <StatCard title="Active Revenue" value={totalRevenue} color="border-cyan-500" isCurrency />
        <StatCard title="Expired Revenue" value={expiredRevenue} color="border-orange-500" isCurrency />
        <StatCard title="Total Revenue" value={grandTotalRevenue} color="border-purple-500" isCurrency />
      </div>

       <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h3 className="text-2xl font-bold text-cyan-400">Active Memberships</h3>
           <div className="relative md:w-1/3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                  type="text"
                  placeholder="Search active members..."
                  value={activeSearchQuery}
                  onChange={(e) => onActiveSearchChange(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 pl-10 pr-4 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  aria-label="Search active members by name"
              />
          </div>
        </div>
        <ClientList clients={activeClients} onRenew={onRenewClient} onEdit={onEditClient} onDelete={onDeleteClient} />
      </div>
      
      {expiredClientsCount > 0 && (
         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-bold text-red-400">Expired Memberships</h3>
                 <div className="relative md:w-1/3">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search expired members..."
                        value={expiredSearchQuery}
                        onChange={(e) => onExpiredSearchChange(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 pl-10 pr-4 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        aria-label="Search expired members by name"
                    />
                </div>
            </div>
            <ClientList clients={expiredClients} onRenew={onRenewClient} onEdit={onEditClient} onDelete={onDeleteClient} />
        </div>
      )}

    </div>
  );
};