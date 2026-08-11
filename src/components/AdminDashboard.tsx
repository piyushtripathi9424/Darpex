import React, { useState } from 'react';
import { StudioBay, ServiceBooking, ServiceItem, CustomerCar } from '../types';
import { STUDIO_BAYS, INITIAL_CUSTOMER_CARS } from '../data/mockData';
import { 
  Wrench, DollarSign, Users, Calendar, TrendingUp, CheckCircle, RefreshCw, 
  Car, ShieldCheck, Plus, Trash2, Edit2, Clock, QrCode, CheckCircle2, AlertCircle, Search, LogOut 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { 
  getAdminBookings, 
  getAdminCustomers, 
  updateAdminBookingStatus, 
  updateAdminBookingSlot, 
  deleteAdminBooking,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  uploadAdminImage,
  verifyAdminBookingPayment,
  AdminCustomer 
} from '../api/admin';

interface AdminDashboardProps {
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  onAdminLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  setServices,
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
  const [newServiceImageFile, setNewServiceImageFile] = useState<File | null>(null);

  // Editing Slot Modal State
  const [editingSlotBookingId, setEditingSlotBookingId] = useState<string | null>(null);
  const [slotDateInput, setSlotDateInput] = useState('');
  const [slotTimeInput, setSlotTimeInput] = useState('3:00 PM');

  // Remove localStorage verifiedTxnIds

  const [adminBookings, setAdminBookings] = useState<ServiceBooking[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [bookingsData, customersData] = await Promise.all([
          getAdminBookings(),
          getAdminCustomers()
        ]);
        
        const mappedBookings: ServiceBooking[] = bookingsData.map((b: any) => ({
          id: b.id,
          bookingNumber: b.bookingNumber,
          customerName: b.customerName,
          customerPhone: b.customerPhone,
          customerEmail: b.customerEmail,
          serviceType: 'studio',
          serviceId: b.services?.[0]?.id || '',
          serviceName: (b.services || []).map((s: any) => s?.name).filter(Boolean).join(', '),
          carDetails: b.vehicle || {},
          addOns: [],
          date: b.date,
          timeSlot: b.timeSlot,
          totalPrice: b.totalPrice,
          status: b.status,
          assignedBay: 'Clean Room Bay #1',
          createdAt: b.createdAt
        }));

        setAdminBookings(mappedBookings);
        const mappedCustomers = customersData.map((c: any) => ({
          ...c,
          registeredCars: (c.registeredCars || []).map((v: any) => ({
            id: v.id,
            make: v.make,
            model: v.model,
            licensePlate: v.registration_number,
            year: v.year || new Date().getFullYear(),
            color: v.color || 'Black',
            image: v.image_url && !v.image_url.includes('unsplash.com') ? v.image_url : '',
            lastServiceDate: 'Newly Added',
            nextRecommendedService: 'Basic Wash & Detailing',
            paintConditionScore: 9.2
          }))
        }));
        
        setCustomers(mappedCustomers);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const handleUpdateBookingStatusLocal = async (bookingId: string, newStatus: ServiceBooking['status']) => {
    try {
      await updateAdminBookingStatus(bookingId, newStatus);
      setAdminBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleDeleteBookingLocal = async (bookingId: string) => {
    if (confirm('Are you sure you want to permanently delete this booking?')) {
      try {
        await deleteAdminBooking(bookingId);
        setAdminBookings(prev => prev.filter(b => b.id !== bookingId));
      } catch (error) {
        console.error('Failed to delete booking', error);
      }
    }
  };

  const handleUpdateBookingSlotLocal = async (bookingId: string, newDate: string, newSlot: string) => {
    try {
      await updateAdminBookingSlot(bookingId, newDate, newSlot);
      setAdminBookings(prev => prev.map(b => b.id === bookingId ? { ...b, date: newDate, timeSlot: newSlot } : b));
      setEditingSlotBookingId(null);
    } catch (error) {
      console.error('Failed to update slot', error);
    }
  };

  // Analytics Metrics
  const totalBookingsCount = adminBookings.length;
  const todayAppointmentsCount = adminBookings.filter(b => b.date.includes('Today') || b.date.includes('12 August') || b.date.includes('2026')).length;
  const totalCustomersCount = customers.length;
  const totalVehiclesCount = customers.reduce((sum, c) => sum + c.registeredCars.length, 0);
  const totalRevenue = adminBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingPaymentsCount = adminBookings.filter(b => b.paymentStatus !== 'Verified').length;

  const revenueData = [
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: 0 },
    { month: 'Aug', revenue: totalRevenue },
  ];

  const serviceDistributionData = [
    { name: 'Ceramic Coating 10H', value: 0, color: '#d4af37' },
    { name: 'PPF Protection', value: 0, color: '#38BDF8' },
    { name: 'Interior Steam', value: 0, color: '#34D399' },
    { name: 'Custom Accessories', value: 0, color: '#F472B6' },
  ];

  // Service Management Handlers
  const handleEditServiceClick = (svc: ServiceItem) => {
    setEditingServiceId(svc.id);
    setNewServiceName(svc.name);
    setNewServiceCategory(svc.category);
    setNewServicePrice(svc.startingPrice);
    setNewServiceDesc(svc.shortDescription);
    setNewServiceImageFile(null);
    setIsAddingService(true);
  };

  const handleCancelServiceForm = () => {
    setIsAddingService(false);
    setEditingServiceId(null);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServiceImageFile(null);
    setNewServicePrice(2999);
  };

  const handleRemoveService = async (serviceId: string) => {
    if (confirm('Are you sure you want to remove this service?')) {
      try {
        await deleteAdminService(serviceId);
        setServices(services.filter(s => s.id !== serviceId));
      } catch (error) {
        console.error('Failed to remove service', error);
      }
    }
  };

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    try {
      let finalImageUrl: string | undefined = undefined;
      
      if (newServiceImageFile) {
        const uploadResult = await uploadAdminImage(newServiceImageFile);
        finalImageUrl = uploadResult.url;
      }

      if (editingServiceId) {
        // Edit mode
        const updatedServiceData = await updateAdminService(editingServiceId, {
          name: newServiceName,
          category: newServiceCategory,
          description: newServiceDesc,
          price: newServicePrice,
          image_url: finalImageUrl || undefined
        });

        setServices(services.map(s => s.id === editingServiceId ? {
          ...s,
          name: updatedServiceData.name || s.name,
          category: updatedServiceData.category || s.category,
          shortDescription: updatedServiceData.description || s.shortDescription,
          startingPrice: updatedServiceData.price || s.startingPrice,
          image: updatedServiceData.image_url || s.image
        } : s));
      } else {
        // Create mode
        const createdServiceData = await createAdminService({
          name: newServiceName,
          category: newServiceCategory,
          description: newServiceDesc,
          price: newServicePrice,
          image_url: finalImageUrl || undefined
        });

        const newService: ServiceItem = {
          id: createdServiceData.id,
          name: createdServiceData.name,
          category: createdServiceData.category.toLowerCase().includes('clean') ? 'interior' : 'coating',
          shortDescription: createdServiceData.description || 'High precision studio vehicle treatment.',
          fullDescription: createdServiceData.description || 'Comprehensive premium detailing and restoration service.',
          startingPrice: createdServiceData.price,
          duration: '2 Hours',
          warranty: '1-Year Assurance',
          image: createdServiceData.image_url || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
          popular: false,
          features: ['Studio Grade Products', 'Certified Technician', 'Quality Inspected'],
          processSteps: [{ step: 1, title: 'Insepction & Prep', description: 'Decontamination.' }]
        };

        setServices([...services, newService]);
      }

      handleCancelServiceForm();
    } catch (error) {
      console.error('Failed to save service', error);
    }
  };

  const handleVerifyPayment = async (bookingId: string) => {
    try {
      await verifyAdminBookingPayment(bookingId);
      setAdminBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paymentStatus: 'Verified' } : b));
    } catch (error) {
      console.error('Failed to verify payment', error);
    }
  };

  const handleSaveSlotChange = (bookingId: string) => {
    if (slotDateInput) {
      handleUpdateBookingSlotLocal(bookingId, slotDateInput, slotTimeInput);
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
            <Calendar className="w-4 h-4" /> Bookings ({adminBookings.length})
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
              {isLoading ? <div className="text-white p-4">Loading bookings...</div> : adminBookings.map((booking) => (
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
                        {booking.paymentStatus === 'Verified' ? 'Payment Verified' : 'QR Payment Received'}
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
                        onClick={() => handleUpdateBookingStatusLocal(booking.id, 'Confirmed')}
                        className={`px-3 py-2 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center ${
                          booking.status === 'Confirmed' ? 'bg-emerald-500 text-black font-extrabold' : 'bg-[#181822] text-zinc-300 border border-[#2a2a3a] hover:bg-[#20202c]'
                        }`}
                      >
                        Confirm Booking
                      </button>

                      <button
                        onClick={() => handleUpdateBookingStatusLocal(booking.id, 'Completed')}
                        className={`px-3 py-2 sm:py-1.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center ${
                          booking.status === 'Completed' ? 'bg-blue-500 text-black font-extrabold' : 'bg-[#181822] text-zinc-300 border border-[#2a2a3a] hover:bg-[#20202c]'
                        }`}
                      >
                        Mark Completed
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel and delete this booking?')) {
                            handleDeleteBookingLocal(booking.id);
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service History */}
                  <div className="pt-2 border-t border-[#262636]">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Service History</h4>
                    <div className="space-y-2">
                      {cust.serviceHistory && cust.serviceHistory.length > 0 ? (
                        cust.serviceHistory.map(history => (
                          <div key={history.id} className="bg-[#181822] p-3 text-xs text-zinc-300 rounded-sm border border-[#262636] flex justify-between items-center">
                            <div>
                              <strong>{history.serviceNames.join(', ') || 'General Service'}</strong>
                              <p className="text-[10px] text-zinc-400">Date: {history.date}</p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                              history.status === 'Completed' ? 'text-emerald-400' : 'text-[#d4af37]'
                            }`}>
                              {history.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-500 italic">No previous service history found.</p>
                      )}
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
                onClick={() => {
                  if (isAddingService) {
                    handleCancelServiceForm();
                  } else {
                    setIsAddingService(true);
                  }
                }}
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
                  {editingServiceId ? 'Edit Studio Service' : 'Create New Studio Service'}
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

                <div>
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">Image Upload (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewServiceImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#181822] border border-[#2a2a3a] p-2 text-xs text-zinc-300 focus:outline-none rounded-sm file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#d4af37] file:text-black hover:file:bg-[#e5c158] cursor-pointer"
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
                      
                      {/* Price Display */}
                      <span className="text-base font-bold text-[#d4af37]">₹{svc.startingPrice}</span>
                    </div>

                    <h4 className="text-base font-bold text-white font-display uppercase tracking-wider mt-3">{svc.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{svc.shortDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-[#262636] flex items-center justify-between">
                    <button
                      onClick={() => handleEditServiceClick(svc)}
                      className="text-[10px] font-bold text-zinc-300 hover:text-white flex items-center gap-1 uppercase tracking-widest"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Service
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
              {adminBookings.map((booking) => {
                const isVerified = booking.paymentStatus === 'Verified';
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
