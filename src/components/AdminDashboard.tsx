import React, { useState } from 'react';
import { StudioBay, ServiceBooking, ServiceItem, CustomerCar } from '../types';
import { STUDIO_BAYS, INITIAL_CUSTOMER_CARS } from '../data/mockData';
import { 
  Wrench, DollarSign, Users, Calendar, TrendingUp, CheckCircle, RefreshCw, 
  Car, ShieldCheck, Plus, Trash2, Edit2, Clock, QrCode, CheckCircle2, AlertCircle, Search, LogOut 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  bookings: ServiceBooking[];
  onUpdateBookingStatus: (bookingId: string, newStatus: ServiceBooking['status']) => void;
  onUpdateBookingSlot?: (bookingId: string, newDate: string, newSlot: string) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onAdminLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  setServices,
  bookings,
  onUpdateBookingStatus,
  onUpdateBookingSlot,
  onDeleteBooking,
  onAdminLogout
}) => {
  const [bays, setBays] = useState<StudioBay[]>(STUDIO_BAYS);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'customers' | 'services' | 'payments'>('overview');

  // Dynamic Services state (able to add, edit price, remove)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);

  // New Service Form State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceItem['category']>('detailing');
  const [newServicePrice, setNewServicePrice] = useState<number>(2999);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Editing Slot Modal State
  const [editingSlotBookingId, setEditingSlotBookingId] = useState<string | null>(null);
  const [slotDateInput, setSlotDateInput] = useState('');
  const [slotTimeInput, setSlotTimeInput] = useState('3:00 PM');

  // Payment Verification State
  const [verifiedTxnIds, setVerifiedTxnIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verifiedTxnIds');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Customers data
  const [customers] = useState([
    {
      id: 'cust-1',
      name: 'Alexander Vance',
      phone: '+91 98765 43210',
      email: 'alex.vance@vanceholdings.com',
      registeredCars: INITIAL_CUSTOMER_CARS,
      totalSpent: 18498,
      status: 'VIP Executive Member'
    },
    {
      id: 'cust-2',
      name: 'Sophia Laurent',
      phone: '+91 98111 22334',
      email: 'sophia.laurent@gmail.com',
      registeredCars: [INITIAL_CUSTOMER_CARS[1]],
      totalSpent: 8499,
      status: 'Standard Member'
    }
  ]);

  // Analytics Metrics
  const totalBookingsCount = bookings.length;
  const todayAppointmentsCount = bookings.filter(b => b.date.includes('Today') || b.date.includes('12 August') || b.date.includes('2026')).length;
  const totalCustomersCount = customers.length;
  const totalVehiclesCount = customers.reduce((sum, c) => sum + c.registeredCars.length, 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0) + 42500;
  const pendingPaymentsCount = bookings.filter(b => b.status === 'Pending' || !verifiedTxnIds.includes(b.id)).length;

  const revenueData = [
    { month: 'Mar', revenue: 42500 },
    { month: 'Apr', revenue: 51200 },
    { month: 'May', revenue: 64800 },
    { month: 'Jun', revenue: 78900 },
    { month: 'Jul', revenue: 89400 },
    { month: 'Aug', revenue: totalRevenue },
  ];

  const serviceDistributionData = [
    { name: 'Ceramic Coating 10H', value: 42, color: '#d4af37' },
    { name: 'PPF Protection', value: 28, color: '#38BDF8' },
    { name: 'Interior Steam', value: 18, color: '#34D399' },
    { name: 'Custom Accessories', value: 12, color: '#F472B6' },
  ];

  // Service Management Handlers
  const handleEditPrice = (serviceId: string, currentPrice: number) => {
    setEditingServiceId(serviceId);
    setEditedPrice(currentPrice);
  };

  const handleSavePrice = (serviceId: string) => {
    setServices(services.map(s => s.id === serviceId ? { ...s, startingPrice: editedPrice } : s));
    setEditingServiceId(null);
  };

  const handleRemoveService = (serviceId: string) => {
    if (confirm('Are you sure you want to remove this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      name: newServiceName,
      category: newServiceCategory,
      shortDescription: newServiceDesc || 'High precision studio vehicle treatment.',
      fullDescription: newServiceDesc || 'Comprehensive premium detailing and restoration service.',
      startingPrice: newServicePrice,
      duration: '2 Hours',
      warranty: '1-Year Assurance',
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
      popular: false,
      features: ['Studio Grade Products', 'Certified Technician', 'Quality Inspected'],
      processSteps: [{ step: 1, title: 'Insepction & Prep', description: 'Decontamination.' }]
    };

    setServices([newService, ...services]);
    setNewServiceName('');
    setNewServiceDesc('');
    setIsAddingService(false);
  };

  const handleVerifyPayment = (bookingId: string) => {
    if (!verifiedTxnIds.includes(bookingId)) {
      const newVerified = [...verifiedTxnIds, bookingId];
      setVerifiedTxnIds(newVerified);
      localStorage.setItem('verifiedTxnIds', JSON.stringify(newVerified));
    }
  };

  const handleSaveSlotChange = (bookingId: string) => {
    if (onUpdateBookingSlot && slotDateInput) {
      onUpdateBookingSlot(bookingId, slotDateInput, slotTimeInput);
    }
    setEditingSlotBookingId(null);
  };

  return (
    <div className="py-8 bg-[#08080a] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Bar */}
        <div className="bg-[#121218] border border-[#2a2a3c] p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shadow-lg">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-light font-display uppercase tracking-wider text-white">
                  Studio <span className="font-bold text-[#d4af37]">Admin Control</span>
                </h1>
                <span className="bg-[#d4af37] text-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">
                  Master Portal
                </span>
              </div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
                Manage Bookings • Customers • Services • QR Payments
              </p>
            </div>
          </div>

          <button
            onClick={onAdminLogout}
            className="bg-[#181822] hover:bg-red-950/80 text-zinc-300 hover:text-red-300 border border-[#2a2a3a] hover:border-red-500/50 px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all rounded-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Total Bookings</span>
            <div className="text-2xl font-bold text-white font-display">{totalBookingsCount}</div>
          </div>

          <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Today's Appts</span>
            <div className="text-2xl font-bold text-[#d4af37] font-display">{todayAppointmentsCount}</div>
          </div>

          <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Total Customers</span>
            <div className="text-2xl font-bold text-sky-400 font-display">{totalCustomersCount}</div>
          </div>

          <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Vehicles</span>
            <div className="text-2xl font-bold text-purple-400 font-display">{totalVehiclesCount}</div>
          </div>

          <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Total Revenue</span>
            <div className="text-2xl font-bold text-emerald-400 font-display">₹{totalRevenue}</div>
          </div>

          <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Pending Payments</span>
            <div className="text-2xl font-bold text-amber-400 font-display">{pendingPaymentsCount}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#262636] pb-4 overflow-x-auto text-xs font-bold uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-sm flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Studio Overview
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-sm flex items-center gap-2 transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <Calendar className="w-4 h-4" /> Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-2.5 rounded-sm flex items-center gap-2 transition-all ${
              activeTab === 'customers'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <Users className="w-4 h-4" /> Customers ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-2.5 rounded-sm flex items-center gap-2 transition-all ${
              activeTab === 'services'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <Wrench className="w-4 h-4" /> Services Catalog ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-2.5 rounded-sm flex items-center gap-2 transition-all ${
              activeTab === 'payments'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <QrCode className="w-4 h-4" /> QR Payments ({pendingPaymentsCount})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Revenue Bar Chart */}
              <div className="lg:col-span-8 bg-[#121218] border border-[#262636] p-6 rounded-sm space-y-4">
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                  Monthly Studio Revenue (₹ INR)
                </h3>
                
                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                      <YAxis stroke="#71717a" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#121218', borderColor: '#262636', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="revenue" fill="#d4af37" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service Distribution Pie */}
              <div className="lg:col-span-4 bg-[#121218] border border-[#262636] p-6 rounded-sm space-y-4">
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                  Service Distribution
                </h3>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        paddingAngle={5}
                      >
                        {serviceDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#121218', borderColor: '#262636', color: '#fff', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-[#262636]">
                  {serviceDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-bold text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light text-white uppercase tracking-wider font-display">
                All Customer Service Bookings
              </h2>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-[#121218] border border-[#262636] p-6 rounded-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262636] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#d4af37] font-mono bg-[#181822] border border-[#d4af37]/30 px-2 py-0.5 rounded-sm">
                          {booking.bookingNumber}
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Date Created: {booking.createdAt}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-display uppercase tracking-wider mt-1">{booking.customerName}</h3>
                      <p className="text-xs text-zinc-400">{booking.customerPhone} • {booking.customerEmail}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#d4af37] font-display">₹{booking.totalPrice}</div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mt-0.5">
                        {verifiedTxnIds.includes(booking.id) ? 'Payment Verified' : 'QR Payment Received'}
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-xs text-zinc-300 bg-[#181822] border border-[#262636] p-4 rounded-sm">
                    <div>
                      <strong className="text-[#d4af37] uppercase text-[10px] tracking-wider block">Service Requested</strong> 
                      {booking.serviceName}
                    </div>
                    <div>
                      <strong className="text-[#d4af37] uppercase text-[10px] tracking-wider block">Vehicle Details</strong> 
                      {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model} ({booking.carDetails.color})
                    </div>
                    <div>
                      <strong className="text-[#d4af37] uppercase text-[10px] tracking-wider block">Reserved Slot</strong> 
                      {booking.date} @ {booking.timeSlot}
                    </div>
                  </div>

                  {/* Actions & Workflow Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setEditingSlotBookingId(booking.id);
                          setSlotDateInput(booking.date);
                          setSlotTimeInput(booking.timeSlot);
                        }}
                        className="bg-[#181822] hover:bg-[#20202c] text-zinc-300 border border-[#2a2a3a] px-3 py-2 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Change Slot
                      </button>

                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'Confirmed')}
                        className={`px-3 py-2 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center ${
                          booking.status === 'Confirmed' ? 'bg-emerald-500 text-black font-extrabold' : 'bg-[#181822] text-zinc-300 border border-[#2a2a3a] hover:bg-[#20202c]'
                        }`}
                      >
                        Confirm Booking
                      </button>

                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'Completed')}
                        className={`px-3 py-2 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center ${
                          booking.status === 'Completed' ? 'bg-blue-500 text-black font-extrabold' : 'bg-[#181822] text-zinc-300 border border-[#2a2a3a] hover:bg-[#20202c]'
                        }`}
                      >
                        Mark Completed
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel and delete this booking?')) {
                            if (onDeleteBooking) onDeleteBooking(booking.id);
                          }
                        }}
                        className="px-3 py-2 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center bg-[#181822] text-red-400 border border-[#2a2a3a] hover:bg-red-950/40 hover:border-red-500/50"
                      >
                        Cancel Booking
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mr-1">Status:</span>
                      <span className="px-3 py-1 bg-[#181822] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest rounded-sm">
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Slot Modal Inline */}
                  {editingSlotBookingId === booking.id && (
                    <div className="p-4 bg-[#181822] border border-[#d4af37]/50 rounded-sm space-y-3 mt-3">
                      <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">Update Booking Slot</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={slotDateInput}
                          onChange={(e) => setSlotDateInput(e.target.value)}
                          placeholder="Date (e.g. 15 August 2026)"
                          className="bg-[#0c0c10] border border-[#2a2a3a] p-2.5 text-xs text-white focus:outline-none rounded-sm"
                        />
                        <select
                          value={slotTimeInput}
                          onChange={(e) => setSlotTimeInput(e.target.value)}
                          className="bg-[#0c0c10] border border-[#2a2a3a] p-2.5 text-xs text-white focus:outline-none rounded-sm"
                        >
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                        </select>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingSlotBookingId(null)}
                          className="px-3 py-1.5 bg-[#20202c] text-xs text-zinc-300 rounded-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveSlotChange(booking.id)}
                          className="px-4 py-1.5 bg-[#d4af37] text-xs text-black font-bold uppercase rounded-sm"
                        >
                          Save New Slot
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMERS & GARAGES */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-light text-white uppercase tracking-wider font-display">
              Customer Profiles & Garage Vehicles
            </h2>

            <div className="space-y-6">
              {customers.map((cust) => (
                <div key={cust.id} className="bg-[#121218] border border-[#262636] p-6 rounded-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262636] pb-3">
                    <div>
                      <span className="text-[10px] text-[#d4af37] bg-[#181822] border border-[#d4af37]/30 px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest">
                        {cust.status}
                      </span>
                      <h3 className="text-lg font-bold text-white font-display uppercase tracking-wider mt-1">{cust.name}</h3>
                      <p className="text-xs text-zinc-400">{cust.phone} • {cust.email}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Lifetime Spent</span>
                      <span className="text-xl font-bold text-[#d4af37] font-display">₹{cust.totalSpent}</span>
                    </div>
                  </div>

                  {/* Registered Vehicles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                      Registered Vehicles ({cust.registeredCars.length})
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      {cust.registeredCars.map((car) => (
                        <div key={car.id} className="bg-[#181822] border border-[#262636] p-4 rounded-sm flex items-center gap-4">
                          <img src={car.image} alt={car.model} className="w-20 h-16 object-cover rounded-sm border border-[#2a2a3a]" />
                          <div className="text-xs space-y-1">
                            <h5 className="font-bold text-white uppercase font-display">{car.make} {car.model} ({car.year})</h5>
                            <p className="text-zinc-400">License Plate: <strong className="text-[#d4af37]">{car.licensePlate}</strong></p>
                            <p className="text-zinc-400">Paint Score: <strong className="text-emerald-400">{car.paintConditionScore}/10</strong></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service History */}
                  <div className="pt-2 border-t border-[#262636]">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Service History</h4>
                    <div className="bg-[#181822] p-3 text-xs text-zinc-300 rounded-sm border border-[#262636] flex justify-between items-center">
                      <div>
                        <strong>Full Car Detailing & Interior Steam Sanitization</strong>
                        <p className="text-[10px] text-zinc-400">Completed on 10 July 2026</p>
                      </div>
                      <span className="text-[#d4af37] font-bold">₹8,499</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light text-white uppercase tracking-wider font-display">
                Service Catalog & Pricing Matrix
              </h2>

              <button
                onClick={() => setIsAddingService(!isAddingService)}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingService ? 'Cancel' : 'Add New Service'}</span>
              </button>
            </div>

            {/* Add Service Modal/Form */}
            {isAddingService && (
              <form onSubmit={handleAddServiceSubmit} className="bg-[#121218] border border-[#d4af37]/40 p-6 rounded-sm space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest font-display">
                  Create New Studio Service
                </h3>

                <div className="grid sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">Service Name</label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Headlight Restoration"
                      className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:outline-none rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">Category</label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value as ServiceItem['category'])}
                      className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:outline-none rounded-sm"
                    >
                      <option value="interior">Interior Restoration</option>
                      <option value="detailing">Exterior Polishing</option>
                      <option value="coating">Ceramic Coating</option>
                      <option value="ppf">PPF Paint Armor</option>
                      <option value="modification">Car Modification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">Starting Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">Description</label>
                  <input
                    type="text"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="Short description of service benefits..."
                    className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-xs text-white focus:outline-none rounded-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-[#d4af37] text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            )}

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => (
                <div key={svc.id} className="bg-[#121218] border border-[#262636] p-5 rounded-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#262636] pb-2">
                      <span className="text-[10px] text-[#d4af37] uppercase font-bold tracking-widest bg-[#181822] px-2 py-0.5 rounded-sm border border-[#d4af37]/20">
                        {svc.category}
                      </span>
                      
                      {/* Price Edit or Display */}
                      {editingServiceId === svc.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(Number(e.target.value))}
                            className="w-20 bg-[#0c0c10] border border-[#d4af37] p-1 text-xs text-white font-bold text-right rounded-sm"
                          />
                          <button
                            onClick={() => handleSavePrice(svc.id)}
                            className="bg-[#d4af37] text-black px-2 py-1 text-[10px] font-bold rounded-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="text-base font-bold text-[#d4af37]">₹{svc.startingPrice}</span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white font-display uppercase tracking-wider mt-3">{svc.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{svc.shortDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-[#262636] flex items-center justify-between">
                    <button
                      onClick={() => handleEditPrice(svc.id, svc.startingPrice)}
                      className="text-xs text-zinc-300 hover:text-[#d4af37] flex items-center gap-1 font-bold uppercase tracking-wider"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Price
                    </button>

                    <button
                      onClick={() => handleRemoveService(svc.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold uppercase tracking-wider"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENTS VERIFICATION */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-xl font-light text-white uppercase tracking-wider font-display">
              QR Payment Verification & Proof Records
            </h2>

            <div className="space-y-4">
              {bookings.map((booking) => {
                const isVerified = verifiedTxnIds.includes(booking.id);
                return (
                  <div key={booking.id} className="bg-[#121218] border border-[#262636] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#d4af37] font-bold">{booking.bookingNumber}</span>
                        <span className="text-xs text-zinc-400">• Customer: {booking.customerName}</span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Service: <strong>{booking.serviceName}</strong> ({booking.carDetails.make} {booking.carDetails.model})
                      </p>
                      <p className="text-[11px] font-mono text-zinc-400">
                        Method: <strong className="text-white">UPI QR Code</strong> | UTR / Txn ID: <strong className="text-[#d4af37]">UPI-REF-{booking.id.slice(-6)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xl font-bold text-[#d4af37] font-display">₹{booking.totalPrice}</span>
                      </div>

                      <button
                        onClick={() => handleVerifyPayment(booking.id)}
                        disabled={isVerified}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm transition-all ${
                          isVerified
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default'
                            : 'bg-[#d4af37] hover:bg-[#e5c158] text-black shadow-lg'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isVerified ? 'Payment Verified ✓' : 'Verify QR Payment'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
