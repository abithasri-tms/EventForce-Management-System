import React from 'react';
import { Calendar, Users, Building2, Handshake, Star, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';
import { EventItem, ClientItem, VendorItem, VenueItem, FeedbackItem, CancellationRequestItem, NotificationLogItem } from '../initialData';

interface DashboardViewProps {
  events: EventItem[];
  clients: ClientItem[];
  vendors: VendorItem[];
  venues: VenueItem[];
  feedback: FeedbackItem[];
  cancellationRequests: CancellationRequestItem[];
  notificationLogs: NotificationLogItem[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  clients,
  vendors,
  venues,
  feedback,
  cancellationRequests,
  notificationLogs,
  onNavigate
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter((e) => e.date >= todayStr && e.status !== 'Canceled');
  const completedEvents = events.filter((e) => e.status === 'Completed');
  const canceledEvents = events.filter((e) => e.status === 'Canceled');
  const availableVenues = venues.filter((v) => v.availabilityStatus === 'Available');
  const availableVendors = vendors.filter((v) => v.status === 'Available');

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : '0.0';

  const totalBudget = events.reduce((sum, e) => sum + (e.budget || 0), 0);

  // Group events by type for visualization
  const typeMap: Record<string, number> = {};
  events.forEach((e) => {
    typeMap[e.type] = (typeMap[e.type] || 0) + 1;
  });

  // Group upcoming events by month for Salesforce Milestone 13 Donut Report
  const monthMap: Record<string, number> = {};
  upcomingEvents.forEach((e) => {
    const month = e.date.substring(0, 7);
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const pendingRequests = cancellationRequests.filter((r) => r.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 rounded-xl shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">EventForce Operations Center</h2>
          <p className="text-sm text-blue-100 mt-1">
            Tracking {events.length} events across {venues.length} venues and {vendors.length} certified vendors.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('events')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition shadow-xs"
          >
            Manage Events
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-blue-800/60 hover:bg-blue-800 text-white rounded-lg border border-blue-400/40 transition"
          >
            View Milestone Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Events</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{events.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">{upcomingEvents.length} Upcoming</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clients</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{clients.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Active Accounts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vendors</span>
            <Handshake className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{vendors.length}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">{availableVendors.length} Available</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Venues</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{venues.length}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">{availableVenues.length} Available</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Feedback</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{avgRating} / 5</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">{feedback.length} Reviews</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Budget Portfolio</span>
            <span className="text-xs font-bold text-emerald-600">₹</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">₹{(totalBudget / 1000).toFixed(0)}k</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Formula Calculated</div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Milestone 13 Donut Report Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Upcoming Events by Month</h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              Milestone 13
            </span>
          </div>
          <div className="space-y-2.5">
            {Object.keys(monthMap).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No upcoming events scheduled.</p>
            ) : (
              Object.entries(monthMap).map(([month, count]) => {
                const pct = Math.round((count / (upcomingEvents.length || 1)) * 100);
                return (
                  <div key={month}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{month}</span>
                      <span>{count} Events ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Events by Type */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Events by Category</h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200">
              Distribution
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(typeMap).map(([type, count]) => {
              const pct = Math.round((count / (events.length || 1)) * 100);
              return (
                <div key={type} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-700">{type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{count}</span>
                    <span className="text-[10px] font-semibold text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Lifecycle Overview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Event Lifecycle Status</h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              CRM Flow
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Confirmed
              </span>
              <span className="font-semibold text-slate-800">
                {events.filter((e) => e.status === 'Confirmed').length}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Planned
              </span>
              <span className="font-semibold text-slate-800">
                {events.filter((e) => e.status === 'Planned').length}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Completed
              </span>
              <span className="font-semibold text-slate-800">{completedEvents.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Pending Cancellation
              </span>
              <span className="font-semibold text-amber-600">{pendingRequests.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Canceled
              </span>
              <span className="font-semibold text-rose-600">{canceledEvents.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Approval Queue & Recent Notification Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending Approval Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Cancellation Approval Queue</h3>
              <p className="text-[11px] text-slate-500">Salesforce Milestone 6 Workflow</p>
            </div>
            <button
              onClick={() => onNavigate('approvals')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              Open Approvals <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingRequests.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-500">
                No events currently awaiting cancellation approval.
              </div>
            ) : (
              pendingRequests.map((req) => {
                const ev = events.find((e) => e.id === req.eventId);
                return (
                  <div key={req.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                    <div className="flex justify-between items-start font-semibold text-slate-800">
                      <span>{ev ? ev.name : req.eventId}</span>
                      <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                        Pending Admin
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{req.reason}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-amber-200/60 text-[10px] text-slate-500">
                      <span>Requested by: {req.requestedBy}</span>
                      <button
                        onClick={() => onNavigate('approvals')}
                        className="font-bold text-blue-700 hover:underline"
                      >
                        Review Request →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Automated Notification Simulation Log */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Automated Email Alert Logs</h3>
              <p className="text-[11px] text-slate-500">Milestones 6 & 7 Classic Email Templates</p>
            </div>
            <button
              onClick={() => onNavigate('approvals')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              View Full Logs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {notificationLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="flex justify-between items-center font-medium text-slate-800">
                  <span className="truncate pr-2 font-semibold">{log.subject}</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">{log.status}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                  <span>To: {log.recipient}</span>
                  <span>{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
