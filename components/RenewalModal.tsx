import React, { useState, useEffect } from 'react';
import { Client, PlanType } from '../types';
import { PLAN_PRICES, PLAN_DURATIONS_MONTHS } from '../constants';
import { Modal } from './Modal';

interface RenewalModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onRenew: (clientId: string, newPlan: PlanType, newStartDate: string, newPaymentNotes: string) => void;
}

const toYYYYMMDD = (date: Date) => {
    return date.toISOString().split('T')[0];
}

export const RenewalModal: React.FC<RenewalModalProps> = ({ client, isOpen, onClose, onRenew }) => {
  const [newPlan, setNewPlan] = useState<PlanType>(PlanType.ONE_MONTH);
  const [newPrice, setNewPrice] = useState(PLAN_PRICES[PlanType.ONE_MONTH]);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [startDate, setStartDate] = useState(() => toYYYYMMDD(new Date()));
  const [endDate, setEndDate] = useState('');


  useEffect(() => {
    if (client && isOpen) {
      setNewPlan(client.plan_type);
      setNewPrice(PLAN_PRICES[client.plan_type]);
      setPaymentNotes(client.payment_notes);
      setStartDate(toYYYYMMDD(new Date())); // Reset to today when modal opens
    }
  }, [client, isOpen]);

  useEffect(() => {
    if (!startDate) return;
    const [year, month, day] = startDate.split('-').map(Number);
    const sDate = new Date(Date.UTC(year, month - 1, day));
    
    const duration = PLAN_DURATIONS_MONTHS[newPlan];
    const eDate = new Date(sDate.getTime());
    const originalDay = sDate.getUTCDate();

    eDate.setUTCMonth(eDate.getUTCMonth() + duration);

    if (eDate.getUTCDate() !== originalDay) {
        eDate.setUTCDate(0);
    }
    setEndDate(eDate.toLocaleDateString(undefined, { timeZone: 'UTC' }));
  }, [startDate, newPlan]);


  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlan = e.target.value as PlanType;
    setNewPlan(selectedPlan);
    setNewPrice(PLAN_PRICES[selectedPlan]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      const [year, month, day] = startDate.split('-').map(Number);
      const utcStartDate = new Date(Date.UTC(year, month - 1, day));
      onRenew(client.id, newPlan, utcStartDate.toISOString(), paymentNotes);
    }
  };

  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Renew Plan for ${client.client_name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-300 mb-1">New Start Date</label>
              <input
                type="date"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New End Date</label>
               <input
                type="text"
                value={endDate}
                readOnly
                className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
              />
            </div>
        </div>

        <div>
          <label htmlFor="plan_type" className="block text-sm font-medium text-gray-300 mb-1">New Plan Type</label>
          <select
            id="plan_type"
            value={newPlan}
            onChange={handlePlanChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          >
            {Object.values(PlanType).map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="plan_price" className="block text-sm font-medium text-gray-300 mb-1">Plan Price</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-600 text-gray-300">₹</span>
            <input
              type="number"
              id="plan_price"
              value={newPrice}
              readOnly
              className="flex-1 block w-full rounded-none rounded-r-md bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label htmlFor="payment_notes" className="block text-sm font-medium text-gray-300 mb-1">Updated Payment Notes</label>
          <textarea
            id="payment_notes"
            rows={4}
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="e.g., ₹2999 Paid"
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors"
          >
            Renew Plan
          </button>
        </div>
      </form>
    </Modal>
  );
};