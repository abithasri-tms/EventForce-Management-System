import React from 'react';
import { CheckCircle2, XCircle, Clock, Mail, ShieldAlert, CheckSquare } from 'lucide-react';
import { CancellationRequestItem, NotificationLogItem, EventItem, VenueItem } from '../initialData';

interface ApprovalsViewProps {
  cancellationRequests: CancellationRequestItem[];
  notificationLogs: NotificationLogItem[];
  events: EventItem[];
  venues: VenueItem[];
  currentRole: string;
  onReviewCancellation: (requestId: string, action: 'approve' | 'reject') => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  cancellationRequests,
  notificationLogs,
  events,
  venues,
  currentRole,
  onReviewCancellation
}) => {
  const canReview = currentRole === 'Event Admin';

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 shadow-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Event Cancellation Approval Process (Salesforce Milestone 6)</h4>
          <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">
            When an event owner or client initiates cancellation, the event enters <strong>Pending Cancellation</strong>. An automated email alert is sent to coordinators. An <strong>Event Admin</strong> reviews the justification: approving it sets the event to <strong>Canceled</strong> and triggers the Apex logic to free the venue back to <strong>Available</strong>. Rejecting reverts it to <strong>Confirmed</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Queue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Pending & Past Approval Requests</h3>
              <p className="text-[11px] text-slate-500">
                {canReview ? 'You have Admin privileges to approve or reject.' : 'Read-only mode (switch to Event Admin to approve)'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {cancellationRequests.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {cancellationRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No cancellation requests recorded.
              </div>
            ) : (
              cancellationRequests.map((req) => {
                const event = events.find((e) => e.id === req.eventId);
                const venue = event ? venues.find((v) => v.id === event.venueId) : null;
                const isPending = req.status === 'Pending';

                return (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border text-xs transition ${
                      isPending
                        ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                        : req.status === 'Approved'
                        ? 'bg-slate-50 border-slate-200 opacity-90'
                        : 'bg-rose-50/50 border-rose-200 opacity-90'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{event ? event.name : req.eventId}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Date: {event?.date} • Venue: {venue?.name || 'Assigned Hall'}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Pending'
                            ? 'bg-amber-200 text-amber-900'
                            : req.status === 'Approved'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="my-2.5 p-2 bg-white/80 rounded border border-slate-200/60 text-slate-700">
                      <span className="font-semibold text-slate-800">Reason: </span>
                      {req.reason}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>
                        Requested by: <strong>{req.requestedBy}</strong> on {req.requestDate}
                      </span>
                      {req.reviewedBy && (
                        <span>
                          Reviewed by <strong>{req.reviewedBy}</strong> ({req.reviewDate})
                        </span>
                      )}
                    </div>

                    {isPending && (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-end gap-2">
                        {canReview ? (
                          <>
                            <button
                              onClick={() => onReviewCancellation(req.id, 'reject')}
                              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              Reject
                            </button>
                            <button
                              onClick={() => onReviewCancellation(req.id, 'approve')}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-2xs transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve Cancellation
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-amber-700 font-medium">
                            Requires Event Admin role to approve
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Email & Workflow Log */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Automated Email Alert Simulator Log</h3>
              <p className="text-[11px] text-slate-500">Record-triggered notifications & classic email templates</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {notificationLogs.length} Dispatched
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notificationLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notification alerts logged yet.
              </div>
            ) : (
              notificationLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      {log.subject}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded uppercase">
                      {log.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>
                      To: <strong>{log.recipient}</strong>
                    </span>
                    <span>{log.date}</span>
                  </div>
                  {log.body && (
                    <pre className="mt-1 p-2 bg-white rounded border border-slate-200 font-sans text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {log.body}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
