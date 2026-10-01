import React, { useState, useEffect } from 'react';
import {
  EventItem,
  ClientItem,
  VendorItem,
  VenueItem,
  EventVendorItem,
  FeedbackItem,
  CancellationRequestItem,
  NotificationLogItem,
  INITIAL_EVENTS,
  INITIAL_CLIENTS,
  INITIAL_VENDORS,
  INITIAL_VENUES,
  INITIAL_EVENT_VENDORS,
  INITIAL_FEEDBACK,
  INITIAL_CANCELLATION_REQUESTS,
  INITIAL_NOTIFICATION_LOGS,
  DEFAULT_BUDGET_BY_TYPE
} from './initialData';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EventsView } from './components/EventsView';
import { ClientsView } from './components/ClientsView';
import { VendorsView } from './components/VendorsView';
import { VenuesView } from './components/VenuesView';
import { EventVendorsView } from './components/EventVendorsView';
import { FeedbackView } from './components/FeedbackView';
import { ApprovalsView } from './components/ApprovalsView';
import { ReportsView } from './components/ReportsView';
import { DocumentationView } from './components/DocumentationView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('Event Admin');

  // Database state initialized from localStorage or initial seed
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('ef_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [clients, setClients] = useState<ClientItem[]>(() => {
    const saved = localStorage.getItem('ef_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [vendors, setVendors] = useState<VendorItem[]>(() => {
    const saved = localStorage.getItem('ef_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [venues, setVenues] = useState<VenueItem[]>(() => {
    const saved = localStorage.getItem('ef_venues');
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });

  const [eventVendors, setEventVendors] = useState<EventVendorItem[]>(() => {
    const saved = localStorage.getItem('ef_eventVendors');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_VENDORS;
  });

  const [feedback, setFeedback] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('ef_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequestItem[]>(() => {
    const saved = localStorage.getItem('ef_cancellationRequests');
    return saved ? JSON.parse(saved) : INITIAL_CANCELLATION_REQUESTS;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLogItem[]>(() => {
    const saved = localStorage.getItem('ef_notificationLogs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_LOGS;
  });

  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ef_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ef_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ef_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('ef_venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem('ef_eventVendors', JSON.stringify(eventVendors));
  }, [eventVendors]);

  useEffect(() => {
    localStorage.setItem('ef_feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem('ef_cancellationRequests', JSON.stringify(cancellationRequests));
  }, [cancellationRequests]);

  useEffect(() => {
    localStorage.setItem('ef_notificationLogs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  // Helper: Venue availability updater (VenueStatusHelper Apex class)
  const refreshVenueStatus = (allEvents: EventItem[], venueId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isReserved = allEvents.some(
      (e) => e.venueId === venueId && (e.status === 'Confirmed' || e.status === 'Planned') && e.date >= today
    );

    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, availabilityStatus: isReserved ? 'Reserved' : 'Available' } : v))
    );
  };

  // Save Event with Milestone 9 PreventDoubleBooking Trigger
  const handleSaveEvent = (data: Partial<EventItem>): { success: boolean; error?: string } => {
    const { id, name, date, type, status, budget, clientId, venueId, description } = data;

    if (!name || !date || !type || !status || !clientId || !venueId) {
      return { success: false, error: 'Validation Error: Event Name, Date, Type, Status, Client, and Venue are all required.' };
    }

    if (budget !== undefined && budget < 0) {
      return { success: false, error: 'Validation Error: Event Budget cannot be negative.' };
    }

    // Double Booking Prevention Trigger
    const doubleBooked = events.find(
      (e) =>
        e.id !== id &&
        e.venueId === venueId &&
        e.date === date &&
        e.status !== 'Canceled' &&
        e.status !== 'Rejected'
    );

    if (doubleBooked) {
      return {
        success: false,
        error: `Validation Error: This Venue is already booked on this date (${date}) for event "${doubleBooked.name}". Double booking is prevented.`
      };
    }

    let updatedEvents: EventItem[];

    if (id) {
      // Edit
      const existing = events.find((e) => e.id === id);
      const oldVenueId = existing?.venueId;

      updatedEvents = events.map((e) =>
        e.id === id
          ? {
              ...e,
              name: name.trim(),
              date,
              type,
              status,
              budget: budget !== undefined ? budget : e.budget,
              clientId,
              venueId,
              description: description || ''
            }
          : e
      );

      setEvents(updatedEvents);
      if (oldVenueId) refreshVenueStatus(updatedEvents, oldVenueId);
      refreshVenueStatus(updatedEvents, venueId);
      triggerToast(`Event "${name}" updated successfully!`, 'success');
    } else {
      // Create
      const newEvent: EventItem = {
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        date,
        type,
        status,
        budget: budget !== undefined ? budget : DEFAULT_BUDGET_BY_TYPE[type] || 15000,
        clientId,
        venueId,
        description: description || '',
        createdAt: new Date().toISOString().split('T')[0],
        owner: currentRole === 'Client' ? 'Ananya Pandey' : 'Michael Jackson'
      };

      updatedEvents = [newEvent, ...events];
      setEvents(updatedEvents);
      refreshVenueStatus(updatedEvents, venueId);
      triggerToast(`Event "${name}" created successfully!`, 'success');
    }

    return { success: true };
  };

  const handleDeleteEvent = (id: string) => {
    const toDelete = events.find((e) => e.id === id);
    if (!toDelete) return;

    const remaining = events.filter((e) => e.id !== id);
    setEvents(remaining);
    setEventVendors((prev) => prev.filter((ev) => ev.eventId !== id));
    setFeedback((prev) => prev.filter((f) => f.eventId !== id));
    refreshVenueStatus(remaining, toDelete.venueId);
    triggerToast(`Event "${toDelete.name}" deleted.`, 'info');
  };

  // Cancellation Workflow (Milestone 6)
  const handleRequestCancel = (eventId: string, reason: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'Pending Cancellation' } : e))
    );

    const newReq: CancellationRequestItem = {
      id: `CR-${Date.now().toString().slice(-4)}`,
      eventId,
      requestedBy: currentRole,
      requestDate: new Date().toISOString().split('T')[0],
      reason,
      status: 'Pending',
      reviewedBy: null,
      reviewDate: null
    };

    setCancellationRequests((prev) => [newReq, ...prev]);

    // Dispatch Email Alert (PDF Milestone 6 Step 6)
    const newLog: NotificationLogItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'Cancellation Request Alert',
      recipient: 'Event Coordinator & Manager',
      subject: `Approval Request: Cancel Event ${event.name}`,
      body: `Hello! An approval request has been submitted to cancel the event: "${event.name}" scheduled on ${event.date}.\nPlease review and take action.\nThank you,\nEventForce Management System`,
      date: new Date().toLocaleString(),
      status: 'Sent'
    };

    setNotificationLogs((prev) => [newLog, ...prev]);
    triggerToast(`Cancellation request submitted! Event is now Pending Cancellation.`, 'success');
  };

  const handleReviewCancellation = (requestId: string, action: 'approve' | 'reject') => {
    const req = cancellationRequests.find((r) => r.id === requestId);
    if (!req) return;

    const event = events.find((e) => e.id === req.eventId);
    if (!event) return;

    const todayStr = new Date().toISOString().split('T')[0];

    if (action === 'approve') {
      const updatedEvents = events.map((e) => (e.id === event.id ? { ...e, status: 'Canceled' as const } : e));
      setEvents(updatedEvents);
      refreshVenueStatus(updatedEvents, event.venueId);

      setCancellationRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'Approved', reviewedBy: currentRole, reviewDate: todayStr } : r
        )
      );

      // Add approval emails (Milestone 6 Step 7)
      const clientEmailLog: NotificationLogItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'Event Cancellation Notice (Client)',
        recipient: event.clientId,
        subject: `Event Cancellation Notice – ${event.name}`,
        body: `Hello!\nWe would like to inform you that the event "${event.name}" on ${event.date} has been canceled.\nThank you,\nEventForce Team`,
        date: new Date().toLocaleString(),
        status: 'Sent'
      };

      const ownerEmailLog: NotificationLogItem = {
        id: `NOTIF-${Date.now().toString().slice(-4) + '1'}`,
        type: 'Approval Notification (Event Owner)',
        recipient: event.owner,
        subject: `Event Cancellation Approved: ${event.name}`,
        body: `Hello ${event.owner},\nYour cancellation request for ${event.name} has been approved. Status is updated to Canceled.\nVenue released.`,
        date: new Date().toLocaleString(),
        status: 'Sent'
      };

      setNotificationLogs((prev) => [clientEmailLog, ownerEmailLog, ...prev]);
      triggerToast(`Cancellation APPROVED! Venue has been released to Available.`, 'success');
    } else {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: 'Confirmed' as const } : e))
      );

      setCancellationRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'Rejected', reviewedBy: currentRole, reviewDate: todayStr } : r
        )
      );

      const rejectLog: NotificationLogItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'Rejection Notification (Event Owner)',
        recipient: event.owner,
        subject: `Event Cancellation Rejected: ${event.name}`,
        body: `Hello ${event.owner},\nYour cancellation request for ${event.name} was rejected by Admin. Event status reverted to Confirmed.`,
        date: new Date().toLocaleString(),
        status: 'Sent'
      };

      setNotificationLogs((prev) => [rejectLog, ...prev]);
      triggerToast(`Cancellation REJECTED. Event returned to Confirmed.`, 'info');
    }
  };

  // Client CRUD with Email Regex Validation
  const handleSaveClient = (data: Partial<ClientItem>): { success: boolean; error?: string } => {
    const { id, name, email, phone, address, country, city } = data;
    if (!name || !email || !phone) {
      return { success: false, error: 'Validation Error: Client Name, Email, and Phone are required.' };
    }

    const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please Enter Valid Email Address (Milestone 5 Validation Rule)' };
    }

    if (id) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, name: name.trim(), email: email.trim(), phone: phone.trim(), address: address || '', country: country || 'India', city: city || 'Hyderabad' } : c
        )
      );
      triggerToast(`Client "${name}" updated!`, 'success');
    } else {
      const newClient: ClientItem = {
        id: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address || '',
        country: country || 'India',
        city: city || 'Hyderabad',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setClients((prev) => [newClient, ...prev]);
      triggerToast(`Client "${name}" added!`, 'success');
    }
    return { success: true };
  };

  const handleDeleteClient = (id: string): { success: boolean; error?: string } => {
    const linked = events.filter((e) => e.clientId === id);
    if (linked.length > 0) {
      triggerToast(`Cannot delete client: linked to ${linked.length} event(s).`, 'error');
      return { success: false, error: 'Client has existing events' };
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
    triggerToast('Client deleted.', 'info');
    return { success: true };
  };

  // Vendor CRUD
  const handleSaveVendor = (data: Partial<VendorItem>): { success: boolean; error?: string } => {
    const { id, name, email, phone, serviceType, status, rating } = data;
    if (!name || !email || !phone || !serviceType) {
      return { success: false, error: 'Validation Error: Name, Email, Phone, and Service Type are required.' };
    }

    if (id) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                serviceType,
                status: status || 'Available',
                rating: rating || 4.5
              }
            : v
        )
      );
      triggerToast(`Vendor "${name}" updated!`, 'success');
    } else {
      const newVendor: VendorItem = {
        id: `VEN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        serviceType,
        status: status || 'Available',
        rating: rating || 4.8
      };
      setVendors((prev) => [newVendor, ...prev]);
      triggerToast(`Vendor "${name}" registered!`, 'success');
    }
    return { success: true };
  };

  const handleDeleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    setEventVendors((prev) => prev.filter((ev) => ev.vendorId !== id));
    triggerToast('Vendor deleted.', 'info');
  };

  // Venue CRUD
  const handleSaveVenue = (data: Partial<VenueItem>): { success: boolean; error?: string } => {
    const { id, name, address, location, capacity, availabilityStatus } = data;
    if (!name || !address || !capacity) {
      return { success: false, error: 'Validation Error: Venue Name, Address, and Capacity are required.' };
    }

    if (id) {
      setVenues((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                name: name.trim(),
                address: address.trim(),
                location: location || '',
                capacity,
                availabilityStatus: availabilityStatus || 'Available'
              }
            : v
        )
      );
      triggerToast(`Venue "${name}" updated!`, 'success');
    } else {
      const newVenue: VenueItem = {
        id: `VNU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        address: address.trim(),
        location: location || '',
        capacity,
        availabilityStatus: availabilityStatus || 'Available'
      };
      setVenues((prev) => [newVenue, ...prev]);
      triggerToast(`Venue "${name}" added!`, 'success');
    }
    return { success: true };
  };

  const handleDeleteVenue = (id: string): { success: boolean; error?: string } => {
    const linked = events.filter((e) => e.venueId === id && e.status !== 'Canceled');
    if (linked.length > 0) {
      triggerToast(`Cannot delete venue: active events are booked in this hall.`, 'error');
      return { success: false, error: 'Venue has active bookings' };
    }
    setVenues((prev) => prev.filter((v) => v.id !== id));
    triggerToast('Venue removed.', 'info');
    return { success: true };
  };

  // EventVendor Assignment
  const handleAssignVendor = (data: { eventId: string; vendorId: string; serviceType: string; notes: string }) => {
    const exists = eventVendors.find((ev) => ev.eventId === data.eventId && ev.vendorId === data.vendorId);
    if (exists) {
      return { success: false, error: 'This vendor is already assigned to this event.' };
    }

    const newAssignment: EventVendorItem = {
      id: `EV-${Date.now().toString().slice(-4)}`,
      eventId: data.eventId,
      vendorId: data.vendorId,
      serviceType: data.serviceType,
      notes: data.notes
    };

    setEventVendors((prev) => [newAssignment, ...prev]);
    setVendors((prev) =>
      prev.map((v) => (v.id === data.vendorId ? { ...v, status: 'Booked' } : v))
    );
    triggerToast('Vendor assigned to event successfully!', 'success');
    return { success: true };
  };

  const handleRemoveAssignment = (id: string) => {
    const assignment = eventVendors.find((ev) => ev.id === id);
    if (!assignment) return;

    setEventVendors((prev) => prev.filter((ev) => ev.id !== id));

    // Release vendor if not in other active events
    const stillAssigned = eventVendors.some((ev) => ev.id !== id && ev.vendorId === assignment.vendorId);
    if (!stillAssigned) {
      setVendors((prev) =>
        prev.map((v) => (v.id === assignment.vendorId ? { ...v, status: 'Available' } : v))
      );
    }
    triggerToast('Vendor assignment removed.', 'info');
  };

  // Feedback with Lookup Filter
  const handleSaveFeedback = (data: Partial<FeedbackItem>): { success: boolean; error?: string } => {
    const { clientId, eventId, rating, comments } = data;
    if (!clientId || !eventId || !rating) {
      return { success: false, error: 'Validation Error: Client, Event, and Rating are required.' };
    }

    const event = events.find((e) => e.id === eventId);
    if (!event || event.clientId !== clientId) {
      return { success: false, error: 'Lookup Filter Violation: The selected event does not belong to this client.' };
    }

    const nextId = `F-${String(feedback.length + 1).padStart(4, '0')}`;
    const newFeedback: FeedbackItem = {
      id: nextId,
      clientId,
      eventId,
      rating,
      comments: comments || '',
      date: new Date().toISOString().split('T')[0]
    };

    setFeedback((prev) => [newFeedback, ...prev]);
    triggerToast('Feedback recorded! Thank you for rating EventForce.', 'success');
    return { success: true };
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedback((prev) => prev.filter((f) => f.id !== id));
    triggerToast('Feedback deleted.', 'info');
  };

  // Automation 1: 3-Day Reminder Flow
  const handleTrigger3DayReminders = () => {
    const today = new Date();
    let sentCount = 0;
    const newLogs: NotificationLogItem[] = [];

    events.forEach((ev) => {
      if (ev.status === 'Confirmed') {
        const evDate = new Date(ev.date);
        const diffDays = Math.ceil((evDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 3) {
          const client = clients.find((c) => c.id === ev.clientId);
          const venue = venues.find((v) => v.id === ev.venueId);

          newLogs.push({
            id: `NOTIF-${Date.now().toString().slice(-4) + sentCount}`,
            type: '3-Day Client Reminder Flow',
            recipient: client ? client.email : 'Client',
            subject: `Reminder: Your Event ${ev.name} is in ${diffDays === 0 ? 'today' : diffDays + ' day(s)'}`,
            body: `Hello ${client ? client.name : 'Valued Client'},\nThis is a reminder that your event "${ev.name}" will take place on ${ev.date}.\nVenue: ${venue ? venue.name : 'TBD'}\nType: ${ev.type}\nWe look forward to seeing you!\n- EventForce Team`,
            date: new Date().toLocaleString(),
            status: 'Sent'
          });
          sentCount++;
        }
      }
    });

    if (sentCount > 0) {
      setNotificationLogs((prev) => [...newLogs, ...prev]);
      triggerToast(`Record-Triggered Flow executed! ${sentCount} reminder email(s) dispatched.`, 'success');
    } else {
      triggerToast(`Flow executed: No confirmed events occur within 3 days.`, 'info');
    }
  };

  // Automation 2: Daily Nightly Batch Job (BatchCompleteEvents Apex)
  const handleRunNightlyBatch = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let count = 0;

    setEvents((prev) =>
      prev.map((e) => {
        if (e.date < todayStr && e.status !== 'Completed' && e.status !== 'Canceled') {
          count++;
          return { ...e, status: 'Completed' };
        }
        return e;
      })
    );

    triggerToast(
      `Daily Nightly Batch (BatchCompleteEvents) finished! ${count} past events updated to Completed.`,
      'success'
    );
  };

  // Reset database to initial seed
  const handleResetData = () => {
    if (!confirm('Reset database to clean initial seed data?')) return;
    localStorage.clear();
    setEvents(INITIAL_EVENTS);
    setClients(INITIAL_CLIENTS);
    setVendors(INITIAL_VENDORS);
    setVenues(INITIAL_VENUES);
    setEventVendors(INITIAL_EVENT_VENDORS);
    setFeedback(INITIAL_FEEDBACK);
    setCancellationRequests(INITIAL_CANCELLATION_REQUESTS);
    setNotificationLogs(INITIAL_NOTIFICATION_LOGS);
    triggerToast('Database reset to initial Naan Mudhalvan dataset!', 'success');
  };

  // Download EventForce.zip directly
  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/EventForce.zip';
    link.download = 'EventForce.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Downloading complete EventForce.zip project package!', 'success');
  };

  const pendingApprovalsCount = cancellationRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentRole={currentRole}
          onRoleChange={(role) => {
            setCurrentRole(role);
            triggerToast(`Switched active profile to: ${role}`, 'info');
          }}
          onRunBatch={handleRunNightlyBatch}
          onTriggerReminders={handleTrigger3DayReminders}
          onResetData={handleResetData}
          onDownloadZip={handleDownloadZip}
        />

        {/* Floating / Toast Alert */}
        {alert && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs transition ${
              alert.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : alert.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <span>{alert.message}</span>
            <button
              onClick={() => setAlert(null)}
              className="text-slate-500 hover:text-slate-800 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Content Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              events={events}
              clients={clients}
              vendors={vendors}
              venues={venues}
              feedback={feedback}
              cancellationRequests={cancellationRequests}
              notificationLogs={notificationLogs}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'events' && (
            <EventsView
              events={events}
              clients={clients}
              venues={venues}
              currentRole={currentRole}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              onRequestCancel={handleRequestCancel}
            />
          )}

          {currentTab === 'clients' && (
            <ClientsView
              clients={clients}
              currentRole={currentRole}
              onSaveClient={handleSaveClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorsView
              vendors={vendors}
              currentRole={currentRole}
              onSaveVendor={handleSaveVendor}
              onDeleteVendor={handleDeleteVendor}
            />
          )}

          {currentTab === 'venues' && (
            <VenuesView
              venues={venues}
              events={events}
              currentRole={currentRole}
              onSaveVenue={handleSaveVenue}
              onDeleteVenue={handleDeleteVenue}
            />
          )}

          {currentTab === 'eventVendors' && (
            <EventVendorsView
              eventVendors={eventVendors}
              events={events}
              vendors={vendors}
              currentRole={currentRole}
              onAssignVendor={handleAssignVendor}
              onRemoveAssignment={handleRemoveAssignment}
            />
          )}

          {currentTab === 'feedback' && (
            <FeedbackView
              feedback={feedback}
              clients={clients}
              events={events}
              currentRole={currentRole}
              onSaveFeedback={handleSaveFeedback}
              onDeleteFeedback={handleDeleteFeedback}
            />
          )}

          {currentTab === 'approvals' && (
            <ApprovalsView
              cancellationRequests={cancellationRequests}
              notificationLogs={notificationLogs}
              events={events}
              venues={venues}
              currentRole={currentRole}
              onReviewCancellation={handleReviewCancellation}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              events={events}
              clients={clients}
              venues={venues}
              vendors={vendors}
              feedback={feedback}
            />
          )}

          {currentTab === 'docs' && <DocumentationView />}
        </main>
      </div>
    </div>
  );
}
