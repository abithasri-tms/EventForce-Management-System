import React, { useState } from 'react';
import { Plus, Search, Star, Trash2, Filter } from 'lucide-react';
import { FeedbackItem, ClientItem, EventItem } from '../initialData';

interface FeedbackViewProps {
  feedback: FeedbackItem[];
  clients: ClientItem[];
  events: EventItem[];
  currentRole: string;
  onSaveFeedback: (feedback: Partial<FeedbackItem>) => { success: boolean; error?: string };
  onDeleteFeedback: (id: string) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedback,
  clients,
  events,
  currentRole,
  onSaveFeedback,
  onDeleteFeedback
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formClientId, setFormClientId] = useState(clients[0]?.id || '');
  const [formEventId, setFormEventId] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComments, setFormComments] = useState('');

  const canDelete = currentRole === 'Event Admin';

  // Events filtered strictly by chosen client (Lookup Filter - Milestone 4 Activity 3)
  const clientAvailableEvents = events.filter((e) => e.clientId === formClientId);

  const handleOpenCreate = () => {
    const firstClient = clients[0]?.id || '';
    setFormClientId(firstClient);
    const availableForFirst = events.filter((e) => e.clientId === firstClient);
    setFormEventId(availableForFirst[0]?.id || '');
    setFormRating(5);
    setFormComments('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleClientChange = (cId: string) => {
    setFormClientId(cId);
    const available = events.filter((e) => e.clientId === cId);
    setFormEventId(available[0]?.id || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientId || !formEventId) {
      setErrorMessage('Validation Error: Client and Event are required.');
      return;
    }

    const res = onSaveFeedback({
      clientId: formClientId,
      eventId: formEventId,
      rating: Number(formRating),
      comments: formComments
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to submit feedback');
      return;
    }

    setIsModalOpen(false);
  };

  const filteredFeedback = feedback.filter((f) => {
    const client = clients.find((c) => c.id === f.clientId);
    const event = events.find((e) => e.id === f.eventId);
    const cName = client ? client.name.toLowerCase() : '';
    const eName = event ? event.name.toLowerCase() : '';
    const comm = f.comments.toLowerCase();

    const matchSearch =
      cName.includes(searchTerm.toLowerCase()) ||
      eName.includes(searchTerm.toLowerCase()) ||
      comm.includes(searchTerm.toLowerCase());
    const matchRating = !ratingFilter || String(f.rating) === ratingFilter;
    return matchSearch && matchRating;
  });

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-4">
      {/* Lookup Filter Highlights Box */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 flex items-start justify-between gap-4 shadow-xs">
        <div>
          <h4 className="font-bold text-sm">Lookup Filter Architecture (Milestone 4, Activity 3)</h4>
          <p className="mt-0.5 text-sky-800 text-[11px] leading-relaxed">
            As mandated in the specification: <em>&quot;When creating Feedback, after selecting a Client, the Event lookup should only show Events of that Client. For example, if Ramesh is chosen, only Ramesh’s events appear, not other clients’ events.&quot;</em> This rule is strictly enforced in both UI selection and backend validation.
          </p>
        </div>
        <div className="text-right flex-shrink-0 bg-white px-3 py-2 rounded-lg border border-sky-200 shadow-2xs">
          <div className="text-lg font-black text-amber-500">⭐ {avgRating} / 5.0</div>
          <div className="text-[10px] text-slate-500 font-semibold">{feedback.length} Customer Reviews</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search comments or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Submit Feedback
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Feedback ID</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comments</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No feedback records found.
                </td>
              </tr>
            ) : (
              filteredFeedback.map((f) => {
                const client = clients.find((c) => c.id === f.clientId);
                const event = events.find((e) => e.id === f.eventId);

                return (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{f.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{client ? client.name : f.clientId}</td>
                    <td className="py-3 px-4 text-blue-700">{event ? event.name : f.eventId}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                        <span className="ml-1 text-slate-700 font-bold">({f.rating}/5)</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">{f.comments}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{f.date}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {canDelete ? (
                        <button
                          onClick={() => {
                            if (confirm('Delete this feedback?')) onDeleteFeedback(f.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
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
              <h3 className="font-bold text-slate-800 text-sm">Submit Client Feedback</h3>
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
                <label className="block font-semibold text-slate-700 mb-1">Select Client *</label>
                <select
                  required
                  value={formClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
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
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Target Event *</span>
                  <span className="text-[10px] text-blue-600 font-semibold">(Filtered to this Client)</span>
                </label>
                {clientAvailableEvents.length === 0 ? (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                    No events exist for this client yet.
                  </div>
                ) : (
                  <select
                    required
                    value={formEventId}
                    onChange={(e) => setFormEventId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    {clientAvailableEvents.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.date} - {e.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rating *</label>
                <select
                  value={formRating}
                  onChange={(e) => setFormRating(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Outstanding</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
                  <option value={3}>⭐⭐⭐ 3 - Average</option>
                  <option value={2}>⭐⭐ 2 - Below Expectations</option>
                  <option value={1}>⭐ 1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Comments / Testimonial</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share feedback on venue acoustics, catering quality, coordinator responsiveness..."
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
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
                  disabled={clientAvailableEvents.length === 0}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold shadow-xs"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
