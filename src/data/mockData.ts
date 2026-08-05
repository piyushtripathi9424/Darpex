import { ServiceItem, CustomerCar, ServiceBooking, StudioBay } from '../types';

export const LUXURY_CAR_BRANDS = [
  'BMW', 'Honda', 'Mercedes-Benz', 'Audi', 'Porsche', 
  'Lamborghini', 'Ferrari', 'Range Rover', 'Tesla', 'Rolls-Royce'
];

export const BODY_TYPES = [
  'Sedan', 'SUV / Crossover', 'Coupe', 'Hatchback', 'Convertible', 'Supercar / Exotic'
];

export const INITIAL_CUSTOMER_CARS: CustomerCar[] = [
  {
    id: 'car-bmw-3',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    color: 'Mineral Grey',
    licensePlate: 'KA01AB1234',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    lastServiceDate: '2026-07-10',
    nextRecommendedService: 'Ceramic Coating Inspection',
    paintConditionScore: 9.8
  },
  {
    id: 'car-honda-city',
    make: 'Honda',
    model: 'City',
    year: 2022,
    color: 'Platinum White',
    licensePlate: 'KA05CD5678',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    lastServiceDate: '2026-06-18',
    nextRecommendedService: 'Full Car Cleaning',
    paintConditionScore: 9.2
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  // Cleaning
  {
    id: 'basic-wash',
    name: 'Basic Wash',
    category: 'interior',
    shortDescription: 'High-pressure foam wash, wheel hub decontamination, and glass wipe.',
    fullDescription: 'Essential touchless snow foam wash, tyre dressing, deionized water spot-free rinse, and floor mat vacuuming.',
    startingPrice: 999,
    duration: '45 Mins',
    warranty: '24-Hour Shine Defense',
    popular: false,
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Touchless Snow Foam Pre-Soak',
      'Deionized Spot-Free Water Rinse',
      'Tyre Dressing & Wheel Hub Scrub',
      'Cabin Glass & Dashboard Wipe'
    ],
    processSteps: [
      { step: 1, title: 'Snow Foam Wash', description: 'Loosens surface grime gently.' },
      { step: 2, title: 'Microfiber Drying', description: 'Ultra-soft microfiber drying towel.' }
    ]
  },
  {
    id: 'interior-cleaning',
    name: 'Interior Cleaning',
    category: 'interior',
    shortDescription: 'Deep steam disinfection, seat extraction, leather conditioning, and ozone sanitization.',
    fullDescription: 'Comprehensive cabin overhaul using 170°C dry vapor steam, leather nourishment, carpet extraction, and HVAC duct sanitization.',
    startingPrice: 1999,
    duration: '2.5 Hours',
    warranty: '6-Month Stain Shield',
    popular: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    features: [
      '170°C Dry Vapor Steam Sterilization',
      'Leather Feeding & Matte UV Shield',
      'High-Torque Carpet & Fabric Extraction',
      'Ozone Air Odor Elimination'
    ],
    processSteps: [
      { step: 1, title: 'Deep Vacuum & Steam', description: 'Removes deep embedded dust and bacteria.' },
      { step: 2, title: 'Leather Feeding', description: 'Restores soft factory matte feel.' }
    ]
  },
  {
    id: 'exterior-detailing',
    name: 'Exterior Detailing',
    category: 'detailing',
    shortDescription: 'Clay bar decontamination, single-stage gloss enhancement polishing, and sealant.',
    fullDescription: 'Restores depth of paint color, removes light swirl marks, and seals the clear coat with synthetic ceramic spray.',
    startingPrice: 2999,
    duration: '3.5 Hours',
    warranty: '6-Month Hydrophobic Seal',
    popular: true,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Iron fallout & Clay Bar Treatment',
      'Single-Stage Machine Polish',
      'Engine Bay Degreasing & Dressing',
      'Hydrophobic Synthetic Sealant'
    ],
    processSteps: [
      { step: 1, title: 'Clay Bar Decontamination', description: 'Strips bonded surface contaminants.' },
      { step: 2, title: 'Jewel Polishing', description: 'Enhances metallic paint clarity.' }
    ]
  },
  {
    id: 'full-car-cleaning',
    name: 'Full Car Cleaning',
    category: 'detailing',
    shortDescription: 'Complete bumper-to-bumper interior steam sanitization plus exterior gloss detailing.',
    fullDescription: 'Our most comprehensive all-in-one cleaning package combining deep interior extraction with exterior machine polishing.',
    startingPrice: 3499,
    duration: '4.5 Hours',
    warranty: '1-Year Clean Assurance',
    popular: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Includes Full Interior Deep Cleaning',
      'Includes Exterior Polish & Sealant',
      'Underbody High-Pressure Wash',
      'Glass & Mirror Rain Repellent'
    ],
    processSteps: [
      { step: 1, title: 'Exterior & Engine Wash', description: 'Complete deep cleaning.' },
      { step: 2, title: 'Cabin Vapor Steam', description: 'Disinfects all interior touchpoints.' }
    ]
  },

  // Protection
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    category: 'coating',
    shortDescription: 'Multi-layer 10H hydrophobic nano-ceramic coat with mirror gloss and 5-year defense.',
    fullDescription: 'Permanent nano-silica ceramic matrix providing self-cleaning 115° water beading, scratch defense, and UV immunity.',
    startingPrice: 4999,
    duration: '1.5 Days (Infrared Cured)',
    warranty: '5-Year Written Warranty',
    popular: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    features: [
      '10H Certified Nano Hardness',
      'Dual-Stage Paint Swirl Correction',
      '115° Hydrophobic Beading',
      'Infrared Curing Bay Stabilization'
    ],
    processSteps: [
      { step: 1, title: 'Dual-Stage Paint Correction', description: 'Removes 90%+ scratches.' },
      { step: 2, title: '10H Matrix Coating', description: 'Bonds permanently to clear coat.' }
    ]
  },
  {
    id: 'paint-protection',
    name: 'Paint Protection (PPF)',
    category: 'ppf',
    shortDescription: 'Self-healing 8mil TPU armor shielding against rock chips and road scratches.',
    fullDescription: 'Custom computer-cut XPEL / Stek self-healing TPU film wrapped around edges for invisible chip protection.',
    startingPrice: 12999,
    duration: '2 Days',
    warranty: '10-Year Anti-Yellowing Warranty',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Self-Healing Under Ambient Heat',
      'Precision Computer Plotter Cuts',
      'Invisible Edge Wraps',
      '100% UV Protection'
    ],
    processSteps: [
      { step: 1, title: 'Precision Cut', description: 'Plotter cut patterns.' },
      { step: 2, title: 'Clean Room Install', description: 'Dust-free positive pressure bay.' }
    ]
  },

  // Modification
  {
    id: 'accessories',
    name: 'Accessories',
    category: 'modification',
    shortDescription: 'Premium ambient lighting, custom floor mats, dashcams, and styling upgrades.',
    fullDescription: 'High-end automotive accessories including app-controlled interior ambient LEDs, 4K front/rear dashcams, and custom leather floor liners.',
    startingPrice: 1499,
    duration: '2 Hours',
    warranty: '2-Year Electrical Warranty',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    features: [
      'App-Controlled RGB Ambient Lighting',
      '4K HDR Front & Rear Dashcams',
      'Custom All-Weather Leather Floor Liners',
      'Preserves Factory Electrical Wiring'
    ],
    processSteps: [
      { step: 1, title: 'OEM Wire Harness Integration', description: 'Zero modification to factory warranty.' }
    ]
  },
  {
    id: 'custom-modification',
    name: 'Custom Modification',
    category: 'modification',
    shortDescription: 'Brake caliper powder coating, starlight headliners, custom wraps, and performance tuning.',
    fullDescription: 'Bespoke vehicle customization including high-heat caliper powder coating, Rolls-Royce fiber optic star headliners, and custom vinyl accents.',
    startingPrice: 8999,
    duration: '1.5 Days',
    warranty: '3-Year Custom Craftsmanship Warranty',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    features: [
      '200°C High-Heat Brake Caliper Powder Coating',
      'Rolls-Royce Style Fiber Optic Starlight Roof',
      'High Gloss / Matte Accent Vinyl Wraps',
      'Custom Performance Exhaust Installation'
    ],
    processSteps: [
      { step: 1, title: 'Precision Disassembly', description: 'Clean room custom craft.' }
    ]
  }
];

export const INITIAL_BOOKINGS: ServiceBooking[] = [
  {
    id: 'b-101',
    bookingNumber: 'PC-2026-8801',
    customerName: 'Alexander Vance',
    customerPhone: '+91 98765 43210',
    customerEmail: 'alex.vance@vanceholdings.com',
    serviceType: 'studio',
    serviceId: 'interior-cleaning',
    serviceName: 'Interior Cleaning',
    carDetails: {
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      color: 'Mineral Grey',
      licensePlate: 'KA01AB1234',
      carType: 'Luxury Sedan'
    },
    addOns: [],
    date: '12 August 2026',
    timeSlot: '3:00 PM',
    totalPrice: 1999,
    status: 'Confirmed',
    assignedBay: 'Clean Room Bay #1',
    createdAt: '2026-08-04'
  }
];

export const STUDIO_BAYS: StudioBay[] = [
  {
    id: 'bay-1',
    name: 'Bay #1 - ISO Clean Room',
    type: 'PPF & Ceramic Installation',
    status: 'Occupied',
    currentVehicle: 'BMW 3 Series (KA01AB1234)',
    currentService: 'Ceramic Coating 10H',
    technicianName: 'Marcus Sterling',
    estimatedCompletion: '3:30 PM Today'
  },
  {
    id: 'bay-2',
    name: 'Bay #2 - Infrared Thermal Curing',
    type: 'Ceramic Heat Stabilization',
    status: 'Available',
    technicianName: 'David Chen'
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 'r-1',
    name: 'Harrison Sterling',
    role: 'BMW 3 Series Owner',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'The attention to detail at Darpex is unparalleled. My BMW looks deeper and glossier than when it rolled off the showroom floor.',
    date: '2 weeks ago',
    verifiedVehicle: 'BMW 3 Series'
  },
  {
    id: 'r-2',
    name: 'Sophia Laurent',
    role: 'Honda City Owner',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'Booked full car cleaning and ceramic coat. The booking was super smooth, paid via QR, and the car was delivered spotless.',
    date: '1 month ago',
    verifiedVehicle: 'Honda City'
  },
  {
    id: 'r-3',
    name: 'James Reynolds',
    role: 'Porsche 911 Owner',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: 'Exceptional service and craftsmanship. The PPF installation was flawless, no edges visible at all. Highly recommend Darpex for high-end vehicles.',
    date: '3 weeks ago',
    verifiedVehicle: 'Porsche 911'
  }
];

export const BEFORE_AFTER_GALLERY = [
  {
    id: 'gal-1',
    category: 'Detailing',
    title: 'Dual-Stage Paint Correction & Gloss Restoration',
    serviceProvided: '2-Stage Machine Jewel Polishing & 10H Ceramic Coat',
    improvementStats: '98% Swirl Mark Elimination',
    vehicle: '2023 BMW 3 Series',
    beforeImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-2',
    category: 'Protection',
    title: 'Full Body Self-Healing PPF Wrap Installation',
    serviceProvided: 'XPEL Stealth Custom Computer Cut Plotter Application',
    improvementStats: '100% Stone Chip Shield',
    vehicle: '2022 Honda City',
    beforeImage: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80'
  }
];

export const MEMBERSHIP_PLANS = [
  {
    id: 'm-1',
    name: 'Executive Care Club',
    monthlyPrice: 2499,
    annualPrice: 24990,
    popular: true,
    badge: 'Most Popular',
    features: ['1 Full Car Cleaning / month', '10% off Ceramic Coating', 'Priority slot booking'],
    perks: ['Free Loaner Vehicle', 'Concierge Flatbed Pickup']
  }
];
