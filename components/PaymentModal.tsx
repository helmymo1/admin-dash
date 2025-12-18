
import React, { useState } from 'react';
import { PaymentRequest, PaymentStatus } from '../types';
import { ICONS } from '../constants';

interface PaymentModalProps {
  payment: PaymentRequest;
  onUpdateStatus: (id: string, status: PaymentStatus, receipt?: string) => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onUpdateStatus, onClose }) => {
  const [receiptUrl, setReceiptUrl] = useState<string>(payment.receiptImage || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Process Payment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <ICONS.X />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Requested by</span>
              <span className="font-semibold text-slate-800">{payment.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-bold text-indigo-600">${payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                payment.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                payment.status === PaymentStatus.PAID ? 'bg-blue-100 text-blue-700' :
                payment.status === PaymentStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                'bg-red-100 text-red-700'
              }`}>{payment.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Payment Receipt</label>
            {receiptUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 h-48 bg-slate-100">
                <img src={receiptUrl} className="w-full h-full object-contain" alt="Receipt" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button 
                    onClick={() => setReceiptUrl('')}
                    className="bg-white text-red-500 p-2 rounded-full hover:scale-110 transition-transform"
                  >
                    <ICONS.Trash />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer hover:bg-indigo-50/50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <ICONS.Plus />
                  </div>
                  <span className="text-indigo-600 font-medium">Upload Receipt</span>
                  <span className="text-slate-400 text-xs text-center px-6">Click to upload JPG, PNG or PDF screens</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onUpdateStatus(payment.id, PaymentStatus.PAID, receiptUrl)}
              className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <ICONS.Check /> Mark as Paid
            </button>
            <button 
              onClick={() => onUpdateStatus(payment.id, PaymentStatus.APPROVED, receiptUrl)}
              className="px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"
            >
              <ICONS.Check /> Approve
            </button>
            <button 
              onClick={() => onUpdateStatus(payment.id, PaymentStatus.REJECTED, receiptUrl)}
              className="col-span-2 px-4 py-3 border border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 flex items-center justify-center gap-2"
            >
              <ICONS.X /> Reject Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
