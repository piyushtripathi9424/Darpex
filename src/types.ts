export type ServiceCategory = 'all' | 'detailing' | 'coating' | 'ppf' | 'interior' | 'modification' | 'maintenance';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  duration: string;
  warranty: string;
  image: string;
  popular?: boolean;
  features: string[];
  processSteps: { step: number; title: string; description: string }[];
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  vehicle: string;
  serviceProvided: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  improvementStats: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  badge: string;
  popular?: boolean;
  perks: string[];
  includedWashes: number;
  coatingDiscounts: number;
}

export interface CustomerCar {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  image: string;
  lastServiceDate: string;
  nextRecommendedService: string;
  paintConditionScore: number; // 1-10
  ceramicCoatingDate?: string;
  ceramicWarrantyUntil?: string;
}

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address?: string;
  serviceType: 'studio' | 'mobile';
  serviceId: string;
  serviceName: string;
  carDetails: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate?: string;
    carType: string;
  };
  addOns: { id: string; name: string; price: number }[];
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'In Bay (Decontamination)' | 'In Bay (Polishing)' | 'In Bay (Curing)' | 'Completed' | 'Cancelled';
  assignedBay?: string;
  createdAt: string;
  paymentStatus?: 'Pending' | 'Verified';
}

export interface StudioBay {
  id: string;
  name: string;
  type: string;
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Sanitizing';
  currentVehicle?: string;
  currentService?: string;
  technicianName?: string;
  estimatedCompletion?: string;
}

export interface AIRecommendation {
  assessmentSummary: string;
  recommendedPackages: {
    title: string;
    description: string;
    estimatedHours: string;
    suggestedAddOns: string[];
  }[];
  paintConditionGrade: string;
  recommendedCuringTime: string;
  expectedLongevityYears: number;
  masterDetailerTip: string;
}
