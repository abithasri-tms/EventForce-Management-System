import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { EventItem, ClientItem, VenueItem, DEFAULT_BUDGET_BY_TYPE } from '../initialData';

interface EventsViewProps {
  events: EventItem[];
  clients: ClientItem[];
  venues: VenueItem[];
  currentRole: string;
  onSaveEvent: (event: Partial<EventItem>) => { success: boolean; error?: string };
  onDeleteEvent: (id: string) => void;
  onRequestCancel: (eventId: string, reason: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  clients,
  venues,
  currentRole,
  onSaveEvent,
  onDeleteEvent,
  onRequestCancel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelEventId, setCancelEventId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formType, setFormType] = useState<EventItem['type']>('Wedding');
  const [formStatus, setFormStatus] = useState<EventItem['status']>('Planned');
  const [formBudget, setFormBudget] = useState<number>(DEFAULT_BUDGET_BY_TYPE.Wedding);
  const [formClientId, setFormClientId] = useState('');
  const [formVenueId, setFormVenueId] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const canEdit = currentRole === 'Event Admin' || currentRole === 'Event Coordinator';
  const isClient = currentRole === 'Client';

  // Apply filters
  const filteredEvents = events.filter((e) => {
    if (isClient && e.clientId !== 'CLI-1001') return false; // Client role private OWD
    const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !typeFilter || e.type === typeFilter;
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleOpenCreate = () => {
    setFormId('');
    setFormName('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormType('Wedding');
    setFormStatus('Planned');
    setFormBudget(DEFAULT_BUDGET_BY_TYPE.Wedding);
    setFormClientId(clients[0]?.id || '');
    setFormVenueId(venues[0]?.id || '');
    setFormDesc('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: EventItem) => {
    setFormId(e.id);
    setFormName(e.name);
    setFormDate(e.date);
    setFormType(e.type);
    setFormStatus(e.status);
    setFormBudget(e.budget);
    setFormClientId(e.clientId);
    setFormVenueId(e.venueId);
    setFormDesc(e.description);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleTypeChange = (newType: EventItem['type']) => {
    setFormType(newType);
    setFormBudget(DEFAULT_BUDGET_BY_TYPE[newType] || 15000);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDate || !formClientId || !formVenueId) {
      setErrorMessage('Validation Error: All marked fields are strictly required.');
      return;
    }

    if (formBudget < 0) {
      setErrorMessage('Validation Error: Event Budget cannot be negative.');
      return;
    }

    const res = onSaveEvent({
      id: formId || undefined,
      name: formName,
      date: formDate,
      type: formType,
      status: formStatus,
      budget: Number(formBudget),
      clientId: formClientId,
      venueId: formVenueId,
      description: formDesc
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to save event');
      return;
    }

    setIsModalOpen(false);
  };

  const handleOpenCancelDialog = (eId: string) => {
    setCancelEventId(eId);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    onRequestCancel(cancelEventId, cancelReason);
    setIsCancelModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search event name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate">Corporate</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Festival">Festival</option>
            <option value="Concert">Concert</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Pending Cancellation">Pending Cancellation</option>
            <option value="Canceled">Canceled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Event
          </button>
        )}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Name & Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No events found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const client = clients.find((c) => c.id === ev.clientId);
                  const venue = venues.find((v) => v.id === ev.venueId);

                  const statusColors: Record<string, string> = {
                    Planned: 'bg-amber-100 text-amber-800',
                    Confirmed: 'bg-blue-100 text-blue-800',
                    Completed: 'bg-slate-100 text-slate-800',
                    'Pending Cancellation': 'bg-amber-200 text-amber-900 border border-amber-300',
                    Canceled: 'bg-rose-100 text-rose-800',
                    Rejected: 'bg-slate-100 text-slate-600'
                  };

                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{ev.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{ev.name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{ev.description}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">{ev.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          {ev.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{client ? client.name : ev.clientId}</td>
                      <td className="py-3 px-4 text-slate-700">{venue ? venue.name : ev.venueId}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">₹{ev.budget.toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[ev.status] || 'bg-slate-100 text-slate-700'}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {canEdit && (
                            <button
                              onClick={() => handleOpenEdit(ev)}
                              title="Edit Event"
                              className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {(ev.status === 'Confirmed' || ev.status === 'Planned') && (
                            <button
                              onClick={() => handleOpenCancelDialog(ev.id)}
                              title="Request Cancellation (Milestone 6 Approval Process)"
                              className="px-2 py-0.5 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                            >
                              Cancel
                            </button>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => onDeleteEvent(ev.id)}
                              title="Delete Event"
                              className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">{formId ? 'Edit Event' : 'Create New Event'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-3.5 text-xs">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun & Meera Grand Wedding"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => handleTypeChange(e.target.value as EventItem['type'])}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Festival">Festival</option>
                    <option value="Concert">Concert</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client *</label>
                  <select
                    required
                    value={formClientId}
                    onChange={(e) => setFormClientId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue *</label>
                  <select
                    required
                    value={formVenueId}
                    onChange={(e) => setFormVenueId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Cap: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EventItem['status'])}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Cancellation">Pending Cancellation</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Budget (₹) * <span className="text-[10px] text-slate-400">(Formula)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Event Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes about schedule, VIP guests, theme..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Request Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 bg-rose-50 flex justify-between items-center">
              <h3 className="font-bold text-rose-900 text-sm">Request Event Cancellation</h3>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                &times;
              </button>
            </div>
            <form onSubmit={handleConfirmCancel} className="p-5 space-y-3.5 text-xs">
              <p className="text-slate-600 text-xs">
                Per <strong>Salesforce Milestone 6</strong>, submitting this request will change the status to{' '}
                <strong>Pending Cancellation</strong> and alert coordinators for approval.
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Cancellation *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Client requested postponement, severe weather warning, logistics change..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
