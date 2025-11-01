import React, { useState, useEffect } from 'react';
import { Client, PlanType } from '../types';
import { PLAN_PRICES, PLAN_DURATIONS_MONTHS } from '../constants';

interface AddEditClientViewProps {
  onSave: (client: Client) => void;
  onCancel: () => void;
  existingClient: Client | null;
}

const getInitialState = (client: Client | null): Client => {
    if (client) return client;

    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + PLAN_DURATIONS_MONTHS[PlanType.ONE_MONTH]);
    
    return {
        id: '', // Will be replaced in App.tsx
        client_name: '',
        client_phone: '',
        client_email: '',
        plan_type: PlanType.ONE_MONTH,
        plan_price: PLAN_PRICES[PlanType.ONE_MONTH],
        payment_notes: '',
        is_active: true,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
    };
};

export const AddEditClientView: React.FC<AddEditClientViewProps> = ({ onSave, onCancel, existingClient }) => {
  const [client, setClient] = useState<Client>(() => getInitialState(existingClient));

  useEffect(() => {
    const startDate = new Date(client.start_date);
    const duration = PLAN_DURATIONS_MONTHS[client.plan_type];
    
    const newEndDate = new Date(startDate.getTime());
    const originalDay = startDate.getUTCDate();
    
    newEndDate.setUTCMonth(newEndDate.getUTCMonth() + duration);

    if (newEndDate.getUTCDate() !== originalDay) {
        newEndDate.setUTCDate(0);
    }
    
    if (newEndDate.toISOString() !== client.end_date) {
        setClient(prev => ({ ...prev, end_date: newEndDate.toISOString() }));
    }
  }, [client.start_date, client.plan_type, client.end_date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'date') {
        const [year, month, day] = value.split('-').map(Number);
        // Create a date object in UTC to avoid timezone shifts.
        const utcDate = new Date(Date.UTC(year, month - 1, day));
        setClient(prev => ({ ...prev, [name]: utcDate.toISOString() }));
    } else {
        setClient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = e.target.value as PlanType;
    setClient(prev => ({
      ...prev,
      plan_type: plan,
      plan_price: PLAN_PRICES[plan],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(client);
  };
  
  const title = existingClient ? 'Edit Client' : 'Add New Client';

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Client Name" name="client_name" value={client.client_name} onChange={handleInputChange} required />
          <InputField label="Client Phone" name="client_phone" type="tel" value={client.client_phone} onChange={handleInputChange} required />
          <InputField label="Client Email" name="client_email" type="email" value={client.client_email} onChange={handleInputChange} required />
          
          <InputField 
            label="Start Date" 
            name="start_date" 
            type="date" 
            value={client.start_date.split('T')[0]} 
            onChange={handleInputChange} 
            required 
          />

          <div>
            <label htmlFor="plan_type" className="block text-sm font-medium text-gray-300 mb-1">Plan Type</label>
            <select
              id="plan_type"
              name="plan_type"
              value={client.plan_type}
              onChange={handlePlanChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            >
              {Object.values(PlanType).map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">End Date (Auto-calculated)</label>
            <input
                type="text"
                value={new Date(client.end_date).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                readOnly
                className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="plan_price" className="block text-sm font-medium text-gray-300 mb-1">Plan Price</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-600 text-gray-300">₹</span>
                <input
                  type="number"
                  id="plan_price"
                  value={client.plan_price}
                  readOnly
                  className="flex-1 block w-full rounded-none rounded-r-md bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="payment_notes" className="block text-sm font-medium text-gray-300 mb-1">Payment Notes</label>
          <textarea
            id="payment_notes"
            name="payment_notes"
            rows={4}
            value={client.payment_notes}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g., ₹999 Paid via UPI"
            required
          />
        </div>
        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-500 transition-colors font-semibold"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({label, name, type = "text", value, onChange, required=false}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
    </div>
);