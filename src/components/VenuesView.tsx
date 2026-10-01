import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Building2, ExternalLink } from 'lucide-react';
import { VenueItem, EventItem } from '../initialData';

interface VenuesViewProps {
  venues: VenueItem[];
  events: EventItem[];
  currentRole: string;
  onSaveVenue: (venue: Partial<VenueItem>) => { success: boolean; error?: string };
  onDeleteVenue: (id: string) => { success: boolean; error?: string };
}

export const VenuesView: React.FC<VenuesViewProps> = ({
  venues,
  events,
  currentRole,
  onSaveVenue,
  onDeleteVenue
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCapacity, setFormCapacity] = useState<number>(500);
  const [formStatus, setFormStatus] = useState<VenueItem['availabilityStatus']>('Available');

  const canManage = currentRole === 'Event Admin';

  const filteredVenues = venues.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || v.availabilityStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenCreate = () => {
    setFormId('');
    setFormName('');
    setFormAddress('');
    setFormLocation('');
    setFormCapacity(500);
    setFormStatus('Available');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VenueItem) => {
    setFormId(v.id);
    setFormName(v.name);
    setFormAddress(v.address);
    setFormLocation(v.location);
    setFormCapacity(v.capacity);
    setFormStatus(v.availabilityStatus);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress || !formCapacity) {
      setErrorMessage('Validation Error: Venue Name, Address, and Capacity are required.');
      return;
    }

    const res = onSaveVenue({
      id: formId || undefined,
      name: formName,
      address: formAddress,
      location: formLocation,
      capacity: Number(formCapacity),
      availabilityStatus: formStatus
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to save venue');
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
              placeholder="Search venue name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Venue
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Venue ID</th>
              <th className="py-3 px-4">Venue Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Current Bookings</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No venues found.
                </td>
              </tr>
            ) : (
              filteredVenues.map((v) => {
                const venueEvents = events.filter((e) => e.venueId === v.id && e.status !== 'Canceled');
                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{v.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{v.name}</span>
                        {v.location && (
                          <a
                            href={v.location}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                            title="Open Google Maps link"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{v.address}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {v.capacity.toLocaleString()} guests
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {venueEvents.length} event(s)
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.availabilityStatus === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.availabilityStatus === 'Reserved'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {v.availabilityStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {canManage ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(v)}
                            title="Edit Venue"
                            className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete venue ${v.name}?`)) onDeleteVenue(v.id);
                            }}
                            title="Delete Venue"
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">{formId ? 'Edit Venue' : 'Add New Venue'}</h3>
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
                <label className="block font-semibold text-slate-700 mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Lotus Ballroom"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity (Persons) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VenueItem['availabilityStatus'])}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Complete venue street address & city..."
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Map URL</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
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
                  Save Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
