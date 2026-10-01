import React from 'react';
import { BookOpen, CheckCircle, HelpCircle, Layers, Shield, Cpu, FileText } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const vivaQuestions = [
    {
      q: '1. What is the business problem solved by the EventForce Management System?',
      a: 'Event Planner Solutions previously handled event bookings, vendor coordination, venue allocations, and feedback across fragmented paper/spreadsheets. EventForce digitizes this into an integrated CRM, reducing manual processes by 60% and eliminating double-booking errors.'
    },
    {
      q: '2. Why did you use a junction object (EventVendor) instead of a direct relationship?',
      a: 'An event requires multiple vendors (catering, photography, music, decor), and a vendor serves multiple events. In relational databases and Salesforce, Many-to-Many relationships cannot be stored in a single table, so the EventVendor junction object splits it into two parent-child relationships.'
    },
    {
      q: '3. How is the PreventDoubleBooking business rule implemented?',
      a: 'In Salesforce Milestone 9, an Apex Trigger prevents two events from reserving the same venue on the same date. In this web application, the save handler inspects existing events and throws a validation error if another active event exists for that venue and date.'
    },
    {
      q: '4. What is the Lookup Filter on the Feedback module?',
      a: 'As specified in Milestone 4 (Activity 3), feedback must link a client to an event they actually hosted. The lookup filter dynamically restricts the event dropdown to show only events where Event.Client__c equals Feedback.Client__c.'
    },
    {
      q: '5. How does the Event Cancellation Approval Process work?',
      a: 'When cancellation is requested, the event enters "Pending Cancellation". An email alert is dispatched to coordinators. An Event Admin reviews the request: approving it marks the event "Canceled" and frees the venue back to "Available". Rejecting reverts it to "Confirmed".'
    },
    {
      q: '6. How does the 3-Day Reminder Flow function?',
      a: 'Replicating the Salesforce Record-Triggered Flow with a Scheduled Path (Milestone 7), the system checks confirmed events occurring within 3 days and generates reminder notifications with event details and venue location.'
    },
    {
      q: '7. What does the Daily Nightly Batch Apex (BatchCompleteEvents) do?',
      a: 'Milestone 10 defines a schedulable batch job running nightly at 8:00 PM that queries all events where Event Date < TODAY and Status != "Completed", automatically transitioning them to "Completed".'
    },
    {
      q: '8. How does the formula field for Event Budget work?',
      a: 'Milestone 4 defines CASE(Event_Type__c, "Wedding", 50000, "Corporate", 30000, "Birthday", 10000, "Anniversary", 20000, "Festival", 60000, "Concert", 40000, "Other", 15000, 0). The app automatically defaults the budget based on this formula.'
    },
    {
      q: '9. What is Organization-Wide Default (OWD) and how is it simulated?',
      a: 'OWD defines the baseline record access for an organization. Event OWD is set to "Private". When switching to the "Client" role in our top bar, the user is restricted to viewing only their own events (e.g. Ananya Pandey).'
    },
    {
      q: '10. What are the key reports generated in the system?',
      a: 'Upcoming Events by Month Report (Milestone 12 & 13), Events by Type, Events by Status, Available Venues Utilization, Available Vendors Directory, Client Feedback Summary, and Event Budget Summary with CSV export.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">Project Guide & Viva Presentation Defense</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Comprehensive documentation mapping all 5 project phases and 18 milestones from the Naan Mudhalvan specification into web architecture concepts.
        </p>
      </div>

      {/* Architecture Mapping Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-sm">1. Salesforce Architecture to Web Implementation Mapping</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">Salesforce Concept</th>
                <th className="py-2.5 px-3">PDF Milestone</th>
                <th className="py-2.5 px-3">Web Equivalent Implementation</th>
                <th className="py-2.5 px-3">Technical Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Custom Objects (5 Objects)</td>
                <td className="py-2.5 px-3">Milestone 2 (p. 6–12)</td>
                <td className="py-2.5 px-3">Relational Collections in JSON Database</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Event, Client, Vendor, Venue, Feedback</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Junction Object (EventVendor__c)</td>
                <td className="py-2.5 px-3">Milestone 2 &amp; 4 (p. 26)</td>
                <td className="py-2.5 px-3">Many-to-Many Linking Table</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">eventId + vendorId + serviceType</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Lookup Filter</td>
                <td className="py-2.5 px-3">Milestone 4 (p. 28–29)</td>
                <td className="py-2.5 px-3">Client-gated Event Dropdown &amp; Validator</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Event.clientId == Feedback.clientId</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Validation Rule (Email Regex)</td>
                <td className="py-2.5 px-3">Milestone 5 (p. 30)</td>
                <td className="py-2.5 px-3">Client form regex check + Backend rule</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">NOT(REGEX(Email__c, &quot;^[a-zA-Z0-9._]+...&quot;))</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Formula Field (Event Budget)</td>
                <td className="py-2.5 px-3">Milestone 4 (p. 18–19)</td>
                <td className="py-2.5 px-3">Automatic Budget Map by Event Type</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Wedding=50k, Corp=30k, Birthday=10k</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Apex Trigger (PreventDoubleBooking)</td>
                <td className="py-2.5 px-3">Milestone 9 (p. 57–59)</td>
                <td className="py-2.5 px-3">Conflict detection on venueId + date</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Blocks duplicate active event on date</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Apex Class (VenueStatusHelper)</td>
                <td className="py-2.5 px-3">Milestone 8 (p. 53–55)</td>
                <td className="py-2.5 px-3">Venue availability state transitions</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Confirmed -&gt; Reserved; Canceled -&gt; Available</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Approval Process (Cancellation)</td>
                <td className="py-2.5 px-3">Milestone 6 (p. 34–43)</td>
                <td className="py-2.5 px-3">Workflow Queue with Admin Review</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Pending Cancellation -&gt; Canceled / Confirmed</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Record-Triggered Flow (3-Day Reminder)</td>
                <td className="py-2.5 px-3">Milestone 7 (p. 44–52)</td>
                <td className="py-2.5 px-3">Automated Email Alert Scanner</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Checks date - today &lt;= 3 days</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Schedulable Apex (BatchCompleteEvents)</td>
                <td className="py-2.5 px-3">Milestone 10 (p. 60–63)</td>
                <td className="py-2.5 px-3">Batch job marking past events Completed</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">date &lt; today &amp;&amp; status != Completed</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Profiles, Roles &amp; Sharing Rules</td>
                <td className="py-2.5 px-3">Milestones 14–18 (p. 71–88)</td>
                <td className="py-2.5 px-3">Role-based UI access &amp; Private OWD filter</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Admin, Coordinator, Vendor Mgr, Client</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Reports &amp; Dashboards</td>
                <td className="py-2.5 px-3">Milestones 12 &amp; 13 (p. 66–70)</td>
                <td className="py-2.5 px-3">KPIs, Donut chart, grouped report tables</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">Upcoming Events by Month Report</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Viva Questions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">2. Evaluator Viva Questions &amp; Ideal Answers</h3>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-900 mb-1">{item.q}</div>
              <div className="text-slate-600 leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
