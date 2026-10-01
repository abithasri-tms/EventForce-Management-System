import React, { useState } from 'react';
import { Plus, Trash2, Network, HelpCircle } from 'lucide-react';
import { EventVendorItem, EventItem, VendorItem } from '../initialData';

interface EventVendorsViewProps {
  eventVendors: EventVendorItem[];
  events: EventItem[];
  vendors: VendorItem[];
  currentRole: string;
  onAssignVendor: (assignment: { eventId: string; vendorId: string; serviceType: string; notes: string }) => {
    success: boolean;
    error?: string;
  };
  onRemoveAssignment: (id: string) => void;
}

export const EventVendorsView: React.FC<EventVendorsViewProps> = ({
  eventVendors,
  events,
  vendors,
  currentRole,
  onAssignVendor,
  onRemoveAssignment
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formEventId, setFormEventId] = useState(events[0]?.id || '');
  const [formVendorId, setFormVendorId] = useState(vendors[0]?.id || '');
  const [formService, setFormService] = useState(vendors[0]?.serviceType || 'Catering');
  const [formNotes, setFormNotes] = useState('');

  const canManage = currentRole !== 'Client';

  const handleOpenModal = () => {
    setFormEventId(events[0]?.id || '');
    const firstVendor = vendors[0];
    setFormVendorId(firstVendor?.id || '');
    setFormService(firstVendor?.serviceType || 'Catering');
    setFormNotes('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleVendorSelectChange = (vId: string) => {
    setFormVendorId(vId);
    const vendor = vendors.find((v) => v.id === vId);
    if (vendor) {
      setFormService(vendor.serviceType);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEventId || !formVendorId) {
      setErrorMessage('Validation Error: Select both an event and a vendor.');
      return;
    }

    const res = onAssignVendor({
      eventId: formEventId,
      vendorId: formVendorId,
      serviceType: formService,
      notes: formNotes
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to assign vendor');
      return;
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Educational Header for Evaluator / Viva */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 flex items-start gap-3 shadow-xs">
        <Network className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">EventVendor Junction Object (Many-to-Many Architecture)</h4>
          <p className="mt-0.5 text-indigo-800 text-[11px] leading-relaxed">
            In Salesforce, a direct Many-to-Many relationship between <code>Event__c</code> and <code>Vendor__c</code> is created using a custom junction object (<code>EventVendor__c</code>) with two Master-Detail relationships. Here, this enables assigning multiple specialized vendors (catering, floral decor, lighting, photography) to any event.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-semibold text-slate-700">
          Total Vendor Assignments: {eventVendors.length}
        </span>

        {canManage && (
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Assign Vendor to Event
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Assignment ID</th>
              <th className="py-3 px-4">Event Name & Date</th>
              <th className="py-3 px-4">Assigned Vendor</th>
              <th className="py-3 px-4">Service Type</th>
              <th className="py-3 px-4">Service Notes / Deliverables</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {eventVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No vendor assignments recorded yet.
                </td>
              </tr>
            ) : (
              eventVendors.map((ev) => {
                const event = events.find((e) => e.id === ev.eventId);
                const vendor = vendors.find((v) => v.id === ev.vendorId);

                return (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{ev.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{event ? event.name : ev.eventId}</div>
                      <div className="text-[11px] text-slate-500">{event?.date}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-indigo-700">
                      {vendor ? vendor.name : ev.vendorId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {ev.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{ev.notes || 'Standard setup'}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {canManage ? (
                        <button
                          onClick={() => {
                            if (confirm('Remove this vendor assignment?')) onRemoveAssignment(ev.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                          title="Remove Assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Assign Vendor to Event</h3>
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
                <label className="block font-semibold text-slate-700 mb-1">Target Event *</label>
                <select
                  required
                  value={formEventId}
                  onChange={(e) => setFormEventId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.date} - {e.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Vendor *</label>
                <select
                  required
                  value={formVendorId}
                  onChange={(e) => handleVendorSelectChange(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.serviceType} - {v.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Type</label>
                <input
                  type="text"
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliverables & Special Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 500 plates dinner, LED wall setup at 2 PM..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                ></textarea>
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
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
