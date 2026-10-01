import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Star, Mail, Phone } from 'lucide-react';
import { VendorItem } from '../initialData';

interface VendorsViewProps {
  vendors: VendorItem[];
  currentRole: string;
  onSaveVendor: (vendor: Partial<VendorItem>) => { success: boolean; error?: string };
  onDeleteVendor: (id: string) => void;
}

const SERVICE_TYPES = [
  'Catering', 'Decor', 'Photography', 'Videography', 'Lighting',
  'Stage Setup', 'Makeup Artist', 'DJ/Music', 'Transportation', 'Hosting/Anchor'
];

export const VendorsView: React.FC<VendorsViewProps> = ({
  vendors,
  currentRole,
  onSaveVendor,
  onDeleteVendor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formService, setFormService] = useState('Catering');
  const [formStatus, setFormStatus] = useState<VendorItem['status']>('Available');
  const [formRating, setFormRating] = useState<number>(4.8);

  const canManage = currentRole === 'Event Admin' || currentRole === 'Vendor Manager';

  const filteredVendors = vendors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = !serviceFilter || v.serviceType === serviceFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    return matchSearch && matchService && matchStatus;
  });

  const handleOpenCreate = () => {
    setFormId('');
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormService('Catering');
    setFormStatus('Available');
    setFormRating(4.8);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VendorItem) => {
    setFormId(v.id);
    setFormName(v.name);
    setFormEmail(v.email);
    setFormPhone(v.phone);
    setFormService(v.serviceType);
    setFormStatus(v.status);
    setFormRating(v.rating || 4.5);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone || !formService) {
      setErrorMessage('Validation Error: All fields are required.');
      return;
    }

    const res = onSaveVendor({
      id: formId || undefined,
      name: formName,
      email: formEmail,
      phone: formPhone,
      serviceType: formService,
      status: formStatus,
      rating: Number(formRating)
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to save vendor');
      return;
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Services</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Vendor
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Vendor ID</th>
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Service Type</th>
              <th className="py-3 px-4">Contact Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No vendors found.
                </td>
              </tr>
            ) : (
              filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{v.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{v.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {v.serviceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{v.email}</td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{v.phone}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {v.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'Booked'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {canManage ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          title="Edit Vendor"
                          className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove vendor ${v.name}?`)) onDeleteVendor(v.id);
                          }}
                          title="Delete Vendor"
                          className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Read Only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">{formId ? 'Edit Vendor' : 'Add New Vendor'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor / Agency Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BeatDrop DJ & Sound"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Type *</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VendorItem['status'])}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@vendor.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rating (1.0 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formRating}
                  onChange={(e) => setFormRating(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
