import React, { useState } from 'react';
import { Download, BarChart2, Calendar, DollarSign, Filter, Users, Building2, Star } from 'lucide-react';
import { EventItem, ClientItem, VenueItem, VendorItem, FeedbackItem } from '../initialData';

interface ReportsViewProps {
  events: EventItem[];
  clients: ClientItem[];
  venues: VenueItem[];
  vendors: VendorItem[];
  feedback: FeedbackItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  events,
  clients,
  venues,
  vendors,
  feedback
}) => {
  const [activeReport, setActiveReport] = useState('upcoming-month');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper for CSV export
  const exportToCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrentReport = () => {
    if (activeReport === 'upcoming-month') {
      const rows: (string | number)[][] = [['Event Name', 'Date', 'Type', 'Client', 'Venue', 'Budget (INR)', 'Status']];
      events
        .filter((e) => e.date >= todayStr && e.status !== 'Canceled')
        .forEach((e) => {
          const client = clients.find((c) => c.id === e.clientId);
          const venue = venues.find((v) => v.id === e.venueId);
          rows.push([e.name, e.date, e.type, client?.name || e.clientId, venue?.name || e.venueId, e.budget, e.status]);
        });
      exportToCSV('EventForce_Upcoming_Events_by_Month', rows);
    } else if (activeReport === 'budget-summary') {
      const rows: (string | number)[][] = [['Event ID', 'Event Name', 'Type', 'Status', 'Date', 'Budget (INR)']];
      events.forEach((e) => rows.push([e.id, e.name, e.type, e.status, e.date, e.budget]));
      exportToCSV('EventForce_Budget_Summary', rows);
    } else {
      const rows: (string | number)[][] = [['Record ID', 'Title', 'Detail', 'Metric']];
      events.forEach((e) => rows.push([e.id, e.name, e.type, e.budget]));
      exportToCSV('EventForce_Report', rows);
    }
  };

  return (
    <div className="space-y-4">
      {/* Report Selection Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveReport('upcoming-month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'upcoming-month'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Upcoming by Month
          </button>
          <button
            onClick={() => setActiveReport('events-by-type')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'events-by-type'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. By Event Type
          </button>
          <button
            onClick={() => setActiveReport('events-by-status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'events-by-status'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. By Status
          </button>
          <button
            onClick={() => setActiveReport('venues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'venues'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            4. Available Venues
          </button>
          <button
            onClick={() => setActiveReport('vendors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'vendors'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            5. Available Vendors
          </button>
          <button
            onClick={() => setActiveReport('feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'feedback'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            6. Client Feedback
          </button>
          <button
            onClick={() => setActiveReport('budget')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeReport === 'budget'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            7. Budget Summary
          </button>
        </div>

        <button
          onClick={handleExportCurrentReport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Report 1: Upcoming Events by Month (Salesforce Milestone 12 Report) */}
      {activeReport === 'upcoming-month' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Report 1: Upcoming Events — Summary by Month
              </h3>
              <p className="text-xs text-slate-500">
                Criteria: Show Me = All Events • Event Date ≥ TODAY • Event Status ≠ Canceled • Grouped by Calendar Month
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Salesforce Milestone 12
            </span>
          </div>

          {(() => {
            const upcoming = events.filter((e) => e.date >= todayStr && e.status !== 'Canceled');
            const grouped: Record<string, EventItem[]> = {};
            upcoming.forEach((e) => {
              const m = e.date.substring(0, 7);
              if (!grouped[m]) grouped[m] = [];
              grouped[m].push(e);
            });

            let grandBudget = 0;

            return (
              <div className="space-y-6">
                {Object.keys(grouped).sort().map((month) => {
                  const mEvents = grouped[month];
                  const mBudget = mEvents.reduce((s, e) => s + (e.budget || 0), 0);
                  grandBudget += mBudget;

                  return (
                    <div key={month} className="space-y-2">
                      <div className="flex justify-between items-center bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-200 text-xs font-bold text-blue-900">
                        <span>📅 Calendar Month: {month} ({mEvents.length} Events)</span>
                        <span>Subtotal Budget: ₹{mBudget.toLocaleString()}</span>
                      </div>

                      <table className="w-full text-left text-xs">
                        <thead className="text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3">Event Name</th>
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Type</th>
                            <th className="py-2 px-3">Client</th>
                            <th className="py-2 px-3">Venue</th>
                            <th className="py-2 px-3">Budget</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {mEvents.map((e) => {
                            const c = clients.find((item) => item.id === e.clientId);
                            const v = venues.find((item) => item.id === e.venueId);
                            return (
                              <tr key={e.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-semibold text-slate-900">{e.name}</td>
                                <td className="py-2.5 px-3">{e.date}</td>
                                <td className="py-2.5 px-3">{e.type}</td>
                                <td className="py-2.5 px-3">{c?.name || e.clientId}</td>
                                <td className="py-2.5 px-3">{v?.name || e.venueId}</td>
                                <td className="py-2.5 px-3 font-medium text-slate-800">₹{e.budget.toLocaleString()}</td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                    {e.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl font-bold text-sm">
                  <span>Grand Total: {upcoming.length} Upcoming Events</span>
                  <span>Total Projected Budget: ₹{grandBudget.toLocaleString()}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Report 2: Events by Type */}
      {activeReport === 'events-by-type' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Report 2: Events by Type Summary</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Total Events</th>
                <th className="py-2.5 px-3">Total Budget</th>
                <th className="py-2.5 px-3">Formula Default Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Festival', 'Concert', 'Other'].map((type) => {
                const list = events.filter((e) => e.type === type);
                const sum = list.reduce((s, e) => s + (e.budget || 0), 0);
                return (
                  <tr key={type} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{type}</td>
                    <td className="py-2.5 px-3">{list.length}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">₹{sum.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {type === 'Wedding' && '₹50,000'}
                      {type === 'Corporate' && '₹30,000'}
                      {type === 'Birthday' && '₹10,000'}
                      {type === 'Anniversary' && '₹20,000'}
                      {type === 'Festival' && '₹60,000'}
                      {type === 'Concert' && '₹40,000'}
                      {type === 'Other' && '₹15,000'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 3: Events by Status */}
      {activeReport === 'events-by-status' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Report 3: Events by Lifecycle Status</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Count</th>
                <th className="py-2.5 px-3">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {['Planned', 'Confirmed', 'Completed', 'Pending Cancellation', 'Canceled', 'Rejected'].map((status) => {
                const count = events.filter((e) => e.status === status).length;
                const pct = ((count / (events.length || 1)) * 100).toFixed(1);
                return (
                  <tr key={status} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{status}</td>
                    <td className="py-2.5 px-3">{count}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 4: Available Venues */}
      {activeReport === 'venues' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Report 4: Venue Capacity & Availability</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Venue Name</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {venues.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{v.name}</td>
                  <td className="py-2.5 px-3">{v.capacity.toLocaleString()} guests</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.availabilityStatus === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {v.availabilityStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{v.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 5: Available Vendors */}
      {activeReport === 'vendors' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Report 5: Available Vendors Directory</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Vendor</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{v.name}</td>
                  <td className="py-2.5 px-3">{v.serviceType}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      {v.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-amber-500">⭐ {v.rating}</td>
                  <td className="py-2.5 px-3 text-slate-600">{v.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 6: Feedback */}
      {activeReport === 'feedback' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Report 6: Client Feedback Summary</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Comments</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedback.map((f) => {
                const c = clients.find((item) => item.id === f.clientId);
                const ev = events.find((item) => item.id === f.eventId);
                return (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{c?.name || f.clientId}</td>
                    <td className="py-2.5 px-3 text-blue-700">{ev?.name || f.eventId}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-500">⭐ {f.rating}/5</td>
                    <td className="py-2.5 px-3 text-slate-600">{f.comments}</td>
                    <td className="py-2.5 px-3 text-slate-500">{f.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 7: Budget Summary */}
      {activeReport === 'budget' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Report 7: Event Budget Summary</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Event Name</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Allocated Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{e.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{e.name}</td>
                  <td className="py-2.5 px-3">{e.date}</td>
                  <td className="py-2.5 px-3">{e.type}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      {e.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">₹{e.budget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
