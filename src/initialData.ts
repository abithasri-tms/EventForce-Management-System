export interface EventItem {
  id: string;
  name: string;
  date: string;
  type: 'Wedding' | 'Corporate' | 'Birthday' | 'Anniversary' | 'Festival' | 'Concert' | 'Other';
  status: 'Planned' | 'Confirmed' | 'Completed' | 'Pending Cancellation' | 'Canceled' | 'Rejected';
  budget: number;
  clientId: string;
  venueId: string;
  description: string;
  createdAt: string;
  owner: string;
}

export interface ClientItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  createdAt: string;
}

export interface VendorItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: 'Available' | 'Booked' | 'Cancelled';
  rating: number;
}

export interface VenueItem {
  id: string;
  name: string;
  address: string;
  location: string;
  capacity: number;
  availabilityStatus: 'Available' | 'Reserved' | 'Not Available';
}

export interface EventVendorItem {
  id: string;
  eventId: string;
  vendorId: string;
  serviceType: string;
  notes: string;
}

export interface FeedbackItem {
  id: string;
  clientId: string;
  eventId: string;
  rating: number;
  comments: string;
  date: string;
}

export interface CancellationRequestItem {
  id: string;
  eventId: string;
  requestedBy: string;
  requestDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy: string | null;
  reviewDate: string | null;
}

export interface NotificationLogItem {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
  status: 'Sent';
}

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "EVT-1001",
    name: "Arun & Meera Grand Wedding",
    date: "2026-10-15",
    type: "Wedding",
    status: "Confirmed",
    budget: 50000,
    clientId: "CLI-1001",
    venueId: "VNU-1001",
    description: "Traditional royal wedding reception with 500 guests and premium multi-course banquet.",
    createdAt: "2026-09-10",
    owner: "Sizzler Jaligam"
  },
  {
    id: "EVT-1002",
    name: "Microsoft Product Launch",
    date: "2026-10-22",
    type: "Corporate",
    status: "Confirmed",
    budget: 30000,
    clientId: "CLI-1002",
    venueId: "VNU-1002",
    description: "Enterprise keynote, live streaming, dynamic lighting, and keynote speaker showcase.",
    createdAt: "2026-09-12",
    owner: "Michael Jackson"
  },
  {
    id: "EVT-1003",
    name: "Riya's 21st Birthday Bash",
    date: "2026-10-05",
    type: "Birthday",
    status: "Confirmed",
    budget: 10000,
    clientId: "CLI-1003",
    venueId: "VNU-1003",
    description: "Youth birthday party with DJ setup, dance floor, neon props and photography.",
    createdAt: "2026-09-14",
    owner: "Michael Jackson"
  },
  {
    id: "EVT-1004",
    name: "Global Tech Summit 2026",
    date: "2026-11-02",
    type: "Corporate",
    status: "Planned",
    budget: 30000,
    clientId: "CLI-1004",
    venueId: "VNU-1004",
    description: "Multi-track international tech summit with breakout sessions and exhibitions.",
    createdAt: "2026-09-18",
    owner: "Sizzler Jaligam"
  },
  {
    id: "EVT-1005",
    name: "Sunburn Youth Music Festival",
    date: "2026-11-15",
    type: "Festival",
    status: "Planned",
    budget: 60000,
    clientId: "CLI-1005",
    venueId: "VNU-1005",
    description: "Open air music festival featuring top EDM artists, lighting trusses, and fireworks.",
    createdAt: "2026-09-20",
    owner: "Michael Jackson"
  },
  {
    id: "EVT-1006",
    name: "Karthik Silver Jubilee Anniversary",
    date: "2026-10-28",
    type: "Anniversary",
    status: "Pending Cancellation",
    budget: 20000,
    clientId: "CLI-1001",
    venueId: "VNU-1006",
    description: "Silver jubilee dinner banquet. Client requested postponement due to overseas travel.",
    createdAt: "2026-09-22",
    owner: "Michael Jackson"
  },
  {
    id: "EVT-1007",
    name: "Acoustic Live Concert Night",
    date: "2026-12-05",
    type: "Concert",
    status: "Planned",
    budget: 40000,
    clientId: "CLI-1002",
    venueId: "VNU-1002",
    description: "Intimate charity acoustic session featuring renowned acoustic players.",
    createdAt: "2026-09-25",
    owner: "Sizzler Jaligam"
  },
  {
    id: "EVT-1008",
    name: "Spring Food & Culture Fest",
    date: "2026-08-14",
    type: "Festival",
    status: "Completed",
    budget: 60000,
    clientId: "CLI-1003",
    venueId: "VNU-1005",
    description: "Culinary celebration with 45 artisan food booths and live street performances.",
    createdAt: "2026-07-01",
    owner: "Michael Jackson"
  },
  {
    id: "EVT-1009",
    name: "DevOps Engineers Meetup",
    date: "2026-08-28",
    type: "Corporate",
    status: "Completed",
    budget: 30000,
    clientId: "CLI-1004",
    venueId: "VNU-1003",
    description: "Cloud-native infrastructure and continuous deployment workshops.",
    createdAt: "2026-07-20",
    owner: "Sizzler Jaligam"
  },
  {
    id: "EVT-1010",
    name: "Autumn Charity Gala Dinner",
    date: "2026-09-05",
    type: "Other",
    status: "Canceled",
    budget: 15000,
    clientId: "CLI-1005",
    venueId: "VNU-1001",
    description: "Charity gala canceled due to hurricane alert; venue smoothly released back to available.",
    createdAt: "2026-08-01",
    owner: "Michael Jackson"
  }
];

export const INITIAL_CLIENTS: ClientItem[] = [
  {
    id: "CLI-1001",
    name: "Ananya Pandey",
    email: "ananya.pandey@example.com",
    phone: "+91 98450 12345",
    address: "45 Green Valley Road, Jubilee Hills",
    country: "India",
    city: "Hyderabad",
    createdAt: "2026-09-01"
  },
  {
    id: "CLI-1002",
    name: "Amit Agarwal",
    email: "amit.agarwal@corptech.com",
    phone: "+91 98200 98765",
    address: "Bandra Kurla Complex, 12th Floor",
    country: "India",
    city: "Mumbai",
    createdAt: "2026-09-02"
  },
  {
    id: "CLI-1003",
    name: "Sophie Martin",
    email: "sophie.martin@genevaevents.ch",
    phone: "+41 22 730 5990",
    address: "Rue du Rhône 14",
    country: "Switzerland",
    city: "Geneva",
    createdAt: "2026-09-03"
  },
  {
    id: "CLI-1004",
    name: "David Miller",
    email: "david.miller@nytech.org",
    phone: "+1 212 555 0199",
    address: "742 Broadway Avenue",
    country: "USA",
    city: "New York",
    createdAt: "2026-09-04"
  },
  {
    id: "CLI-1005",
    name: "Fatima Al-Zahra",
    email: "fatima.zahra@gulfcorp.ae",
    phone: "+971 4 312 4455",
    address: "Downtown Business Bay Tower A",
    country: "Dubai",
    city: "Riyadh",
    createdAt: "2026-09-05"
  },
  {
    id: "CLI-1006",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@chennaievents.in",
    phone: "+91 94440 55667",
    address: "18 Anna Salai, T. Nagar",
    country: "India",
    city: "Chennai",
    createdAt: "2026-09-06"
  }
];

export const INITIAL_VENDORS: VendorItem[] = [
  {
    id: "VEN-1001",
    name: "Royal Feast Caterers",
    email: "info@royalfeast.com",
    phone: "+91 98401 23456",
    serviceType: "Catering",
    status: "Booked",
    rating: 4.8
  },
  {
    id: "VEN-1002",
    name: "DreamScape Floral & Stage Decor",
    email: "hello@dreamscapedecor.com",
    phone: "+91 98402 34567",
    serviceType: "Decor",
    status: "Booked",
    rating: 4.9
  },
  {
    id: "VEN-1003",
    name: "LensCraft Studio & Cinematography",
    email: "bookings@lenscraft.com",
    phone: "+91 98403 45678",
    serviceType: "Photography",
    status: "Available",
    rating: 4.7
  },
  {
    id: "VEN-1004",
    name: "BeatDrop DJ & Acoustic Sound",
    email: "djbeats@beatdrop.com",
    phone: "+91 98404 56789",
    serviceType: "DJ/Music",
    status: "Available",
    rating: 4.6
  },
  {
    id: "VEN-1005",
    name: "Lumina Pro Stage & Architectural Lighting",
    email: "support@luminaevents.com",
    phone: "+91 98405 67890",
    serviceType: "Lighting",
    status: "Booked",
    rating: 4.9
  },
  {
    id: "VEN-1006",
    name: "MotionCraft 4K Videography",
    email: "shoot@motioncraft.com",
    phone: "+91 98406 78901",
    serviceType: "Videography",
    status: "Available",
    rating: 4.5
  },
  {
    id: "VEN-1007",
    name: "Glamour Touch Bridal & Event Makeup",
    email: "contact@glamourtouch.com",
    phone: "+91 98407 89012",
    serviceType: "Makeup Artist",
    status: "Available",
    rating: 4.8
  },
  {
    id: "VEN-1008",
    name: "PrimeLine Executive Chauffeur & Fleet",
    email: "fleet@primelinetrans.com",
    phone: "+91 98408 90123",
    serviceType: "Transportation",
    status: "Available",
    rating: 4.6
  }
];

export const INITIAL_VENUES: VenueItem[] = [
  {
    id: "VNU-1001",
    name: "ITC Grand Chola Banquet Hall",
    address: "63 Mount Road, Guindy, Chennai",
    location: "https://maps.google.com/?q=ITC+Grand+Chola",
    capacity: 800,
    availabilityStatus: "Reserved"
  },
  {
    id: "VNU-1002",
    name: "Taj Krishna Grand Ballroom",
    address: "Road No. 1, Banjara Hills, Hyderabad",
    location: "https://maps.google.com/?q=Taj+Krishna+Hyderabad",
    capacity: 650,
    availabilityStatus: "Reserved"
  },
  {
    id: "VNU-1003",
    name: "The Leela Palace Royal Pavilion",
    address: "23 Old Airport Road, Kodihalli, Bangalore",
    location: "https://maps.google.com/?q=The+Leela+Palace+Bangalore",
    capacity: 450,
    availabilityStatus: "Reserved"
  },
  {
    id: "VNU-1004",
    name: "Hyderabad International Convention Centre (HICC)",
    address: "Novotel & HICC Complex, Hitec City, Hyderabad",
    location: "https://maps.google.com/?q=HICC+Hyderabad",
    capacity: 2500,
    availabilityStatus: "Available"
  },
  {
    id: "VNU-1005",
    name: "Palace Grounds Open Arena",
    address: "Jayamahal Main Road, Armane Nagar, Bangalore",
    location: "https://maps.google.com/?q=Palace+Grounds+Bangalore",
    capacity: 5000,
    availabilityStatus: "Available"
  },
  {
    id: "VNU-1006",
    name: "JW Marriott Grand Lotus Ballroom",
    address: "IA Project Road, Chhatrapati Shivaji Airport, Mumbai",
    location: "https://maps.google.com/?q=JW+Marriott+Mumbai",
    capacity: 500,
    availabilityStatus: "Available"
  }
];

export const INITIAL_EVENT_VENDORS: EventVendorItem[] = [
  {
    id: "EV-1001",
    eventId: "EVT-1001",
    vendorId: "VEN-1001",
    serviceType: "Catering",
    notes: "Full 5-course gourmet banquet menu for 500 attendees."
  },
  {
    id: "EV-1002",
    eventId: "EVT-1001",
    vendorId: "VEN-1002",
    serviceType: "Decor",
    notes: "Floral entrance archway and royal mandap setup."
  },
  {
    id: "EV-1003",
    eventId: "EVT-1002",
    vendorId: "VEN-1005",
    serviceType: "Lighting",
    notes: "Keynote stage spot lights, LED walls and truss rig."
  },
  {
    id: "EV-1004",
    eventId: "EVT-1002",
    vendorId: "VEN-1003",
    serviceType: "Photography",
    notes: "Live event coverage, press conference photos, and product stills."
  },
  {
    id: "EV-1005",
    eventId: "EVT-1003",
    vendorId: "VEN-1004",
    serviceType: "DJ/Music",
    notes: "Youth hit playlist, sound system, and smoke effects."
  },
  {
    id: "EV-1006",
    eventId: "EVT-1008",
    vendorId: "VEN-1001",
    serviceType: "Catering",
    notes: "Multi-cuisine food counters and live dessert station."
  }
];

export const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: "F-0001",
    clientId: "CLI-1003",
    eventId: "EVT-1008",
    rating: 5,
    comments: "Flawless organization! The food stalls and audio systems operated smoothly throughout the whole day.",
    date: "2026-08-16"
  },
  {
    id: "F-0002",
    clientId: "CLI-1004",
    eventId: "EVT-1009",
    rating: 5,
    comments: "Exceptional venue facilities and coordinator responsiveness. Our speakers were very happy.",
    date: "2026-08-30"
  },
  {
    id: "F-0003",
    clientId: "CLI-1001",
    eventId: "EVT-1001",
    rating: 5,
    comments: "The wedding planning team was so attentive. Every vendor arrived on schedule. Thank you EventForce!",
    date: "2026-09-12"
  },
  {
    id: "F-0004",
    clientId: "CLI-1002",
    eventId: "EVT-1002",
    rating: 4,
    comments: "Great tech setup and communication. Venue acoustics were top notch.",
    date: "2026-09-15"
  },
  {
    id: "F-0005",
    clientId: "CLI-1005",
    eventId: "EVT-1010",
    rating: 4,
    comments: "Handled our unexpected weather cancellation professionally with full venue release and fast communication.",
    date: "2026-09-08"
  }
];

export const INITIAL_CANCELLATION_REQUESTS: CancellationRequestItem[] = [
  {
    id: "CR-1001",
    eventId: "EVT-1006",
    requestedBy: "Michael Jackson (Event Coordinator)",
    requestDate: "2026-09-26",
    reason: "Client requested postponement due to overseas family travel conflict.",
    status: "Pending",
    reviewedBy: null,
    reviewDate: null
  }
];

export const INITIAL_NOTIFICATION_LOGS: NotificationLogItem[] = [
  {
    id: "NOTIF-1001",
    type: "Cancellation Alert",
    recipient: "sushanth2805@gmail.com (Event Coordinator)",
    subject: "Approval Request: Cancel Event Karthik Silver Jubilee Anniversary",
    body: "Hello! An approval request has been submitted to cancel the event: Karthik Silver Jubilee Anniversary. Please review and take action.",
    date: "2026-09-26 10:15",
    status: "Sent"
  },
  {
    id: "NOTIF-1002",
    type: "Client 3-Day Reminder",
    recipient: "ananya.pandey@example.com",
    subject: "Reminder: Your Event Arun & Meera Grand Wedding is in 3 days",
    body: "Hello Ananya Pandey,\nThis is a reminder that your event Arun & Meera Grand Wedding will take place on 2026-10-15.\nVenue: ITC Grand Chola Banquet Hall\nType: Wedding\nWe look forward to seeing you!\n- EventForce Team",
    date: "2026-09-25 09:00",
    status: "Sent"
  }
];

export const DEFAULT_BUDGET_BY_TYPE: Record<string, number> = {
  Wedding: 50000,
  Corporate: 30000,
  Birthday: 10000,
  Anniversary: 20000,
  Festival: 60000,
  Concert: 40000,
  Other: 15000
};
