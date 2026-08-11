import React, { useState, useEffect } from 'react';
import { CustomerCar, ServiceBooking } from '../types';
import { INITIAL_CUSTOMER_CARS } from '../data/mockData';
import { Car, Clock, Plus, Trash2, Edit2, ShieldCheck, ArrowRight, Calendar, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, uploadVehicleImage, Vehicle } from '../api/vehicles';
import { useToast } from './ToastContext';

interface CustomerDashboardProps {
  bookings: ServiceBooking[];
  onOpenBooking: (serviceId?: string, preselectedCar?: CustomerCar) => void;
  defaultSubTab?: 'garage' | 'services';
  userName?: string;
  cars: CustomerCar[];
  setCars: (cars: CustomerCar[]) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onTabChange?: (tab: 'garage' | 'services') => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  bookings,
  onOpenBooking,
  defaultSubTab = 'garage',
  userName,
  cars,
  setCars,
  onDeleteBooking,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<'garage' | 'services'>(defaultSubTab);
  const { toast } = useToast();



  // Add / Edit Car Modal State
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('3 Series');
  const [licensePlate, setLicensePlate] = useState('KA01AB1234');
  const [year, setYear] = useState('2023');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const openAddModal = () => {
    setEditingCarId(null);
    setMake('');
    setModel('');
    setLicensePlate('');
    setYear('2024');
    setImage('');
    setImageFile(null);
    setShowAddCarModal(true);
  };

  const openEditModal = (car: CustomerCar) => {
    setEditingCarId(car.id);
    setMake(car.make);
    setModel(car.model);
    setLicensePlate(car.licensePlate);
    setYear(String(car.year));
    setImage(car.image);
    setImageFile(null);
    setShowAddCarModal(true);
  };

  const handleDeleteCar = async (carId: string) => {
    if (confirm('Are you sure you want to remove this vehicle from your garage?')) {
      try {
        await deleteVehicle(carId);
        const carToDelete = cars.find(c => c.id === carId);
        setCars(cars.filter(c => c.id !== carId));
        if (carToDelete) {
          toast(`${carToDelete.make} ${carToDelete.model} has been removed.`, 'info');
        }
      } catch (error: any) {
        toast(error.response?.data?.error || 'Failed to delete vehicle', 'error');
      }
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl: string | undefined = image || undefined;
      
      if (imageFile) {
        const uploadResult = await uploadVehicleImage(imageFile);
        finalImageUrl = uploadResult.url;
      }

      if (editingCarId) {
        const updatedVehicle = await updateVehicle(editingCarId, {
          make,
          model,
          registration_number: licensePlate,
          year: Number(year),
          image_url: finalImageUrl || undefined
        } as any);

        setCars(cars.map(c => c.id === editingCarId ? {
          ...c,
          make,
          model,
          licensePlate,
          year: Number(year),
          image: finalImageUrl || c.image
        } : c));
        toast(`${make} ${model} details updated.`, 'success');
      } else {
        const createdVehicle = await addVehicle({
          make,
          model,
          registration_number: licensePlate,
          year: Number(year),
          color: 'Black',
          image_url: finalImageUrl || undefined,
        });
        
        const createdCar: CustomerCar = {
          id: createdVehicle.id,
          make: createdVehicle.make,
          model: createdVehicle.model,
          licensePlate: createdVehicle.registration_number,
          year: createdVehicle.year || new Date().getFullYear(),
          color: createdVehicle.color || 'Black',
          image: createdVehicle.image_url || '',
          lastServiceDate: 'Newly Added',
          nextRecommendedService: 'Basic Wash & Detailing',
          paintConditionScore: 9.2
        };
        setCars([...cars, createdCar]);
        toast(`${make} ${model} added to your garage.`, 'success');
      }
      setShowAddCarModal(false);
    } catch (error) {
      toast('Failed to save vehicle details', 'error');
    }
  };

  // Previous Services
  const staticPreviousServices: any[] = [];

  const activeBookings = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled');
  const completedBookings = bookings.filter(b => b.status === 'Completed').map(b => ({
    id: b.id,
    vehicleName: b.carDetails ? `${b.carDetails.make} ${b.carDetails.model} (${b.carDetails.licensePlate || 'Registered'})` : 'Unknown Vehicle',
    serviceName: b.serviceName,
    date: b.date,
    totalPrice: b.totalPrice,
    carObj: b.carDetails,
    serviceId: b.serviceId
  }));

  const previousServices = [...completedBookings, ...staticPreviousServices];

  return (
    <div className="py-10 bg-[#08080a] min-h-[85vh] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Customer Profile Banner */}
        {(() => {
          const clientName = userName || 'Customer';
          const nameParts = clientName.split(' ');
          const initials = nameParts.length >= 2 
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : clientName.slice(0, 2).toUpperCase();
            
          return (
            <div className="bg-[#121218] border border-[#2a2a3c] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-sm bg-[#d4af37] text-black font-black text-xl flex items-center justify-center shadow-lg font-display">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                    <h1 className="text-2xl font-light tracking-tight text-white font-display uppercase break-words">
                      {nameParts[0]} <span className="font-bold text-[#d4af37]">{nameParts.slice(1).join(' ')}</span>
                    </h1>
                    <span className="inline-block w-fit bg-[#181822] text-[#d4af37] border border-[#d4af37]/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1 sm:mt-1 break-words">
                    Account Active • Garage Enabled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-[#181822] border border-[#262636] p-4 rounded-sm text-center">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block">Registered Cars</span>
                  <div className="text-xl font-bold text-white font-display">{cars.length} Vehicles</div>
                </div>
                <div className="h-8 w-px bg-[#262636]" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block">Active Bookings</span>
                  <div className="text-xl font-bold text-[#d4af37] font-display">{activeBookings.length} Services</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#262636] pb-4">
          <button
            onClick={() => {
              setActiveTab('garage');
              if (onTabChange) onTabChange('garage');
            }}
            className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
              activeTab === 'garage'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <Car className="w-4 h-4" /> My Garage ({cars.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('services');
              if (onTabChange) onTabChange('services');
            }}
            className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
              activeTab === 'services'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'bg-[#121218] text-zinc-400 hover:text-white border border-[#262636]'
            }`}
          >
            <Clock className="w-4 h-4" /> My Services ({activeBookings.length + previousServices.length})
          </button>
        </div>

        {/* TAB 1: MY GARAGE */}
        {activeTab === 'garage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light text-white uppercase tracking-wider font-display">
                  My Vehicle Garage
                </h2>
                <p className="text-xs text-zinc-400 uppercase tracking-widest">
                  Manage your vehicles for 1-click service booking
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-lg rounded-sm"
              >
                <Plus className="w-4 h-4" /> Add New Vehicle
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-[#121218] border border-[#262636] rounded-sm overflow-hidden p-6 space-y-4 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-sm overflow-hidden border border-[#262636]">
                      <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-black/90 px-3 py-1 border border-[#2a2a3a] text-[#d4af37] font-bold text-[10px] uppercase tracking-widest">
                        Reg: {car.licensePlate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white font-display uppercase tracking-wider">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mt-0.5">
                          Year: {car.year} • Reg No: {car.licensePlate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(car)}
                          className="p-2 bg-[#181822] hover:bg-[#20202c] text-zinc-300 border border-[#2a2a3a] rounded-sm"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="p-2 bg-[#181822] hover:bg-red-950 text-red-400 border border-red-900/50 rounded-sm"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(undefined, car)}
                    className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors mt-4 shadow-md rounded-sm"
                  >
                    <span>Book Service For This Car</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-10">
            
            {/* UPCOMING SERVICES SECTION */}
            <div className="space-y-4">
              <div className="border-b border-[#262636] pb-3">
                <h2 className="text-xl font-light text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d4af37]" /> Upcoming & Active Services
                </h2>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mt-0.5">
                  Confirmed appointments and service status
                </p>
              </div>

              {activeBookings.length === 0 ? (
                <div className="bg-[#121218] border border-[#262636] p-8 text-center text-zinc-400 text-xs uppercase tracking-widest rounded-sm">
                  No upcoming services scheduled. Select a vehicle in your garage to book your next service!
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((b) => (
                    <div key={b.id} className="bg-[#121218] border border-[#d4af37]/40 p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/30 bg-[#181822] px-3 py-1 uppercase tracking-widest">
                            Ref: {b.bookingNumber}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 border border-emerald-500/30 uppercase tracking-widest">
                            Status: {b.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white font-display uppercase tracking-wider">
                          {b.serviceName}
                        </h3>

                        <p className="text-xs text-zinc-300">
                          Vehicle: <span className="text-white font-semibold">{b.carDetails?.make || 'Unknown'} {b.carDetails?.model || ''}</span> ({b.carDetails?.licensePlate || 'Registered'})
                        </p>

                        <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-4 pt-1">
                          <span className="flex items-center gap-1.5 text-[#e5c158] uppercase tracking-wider text-xs font-semibold">
                            <Calendar className="w-3.5 h-3.5" /> Date: {b.date} @ {b.timeSlot}
                          </span>
                        </div>
                      </div>

                      <div className="text-right space-y-2 flex flex-col items-end">
                        <div className="text-2xl font-bold text-[#d4af37] font-display">₹{b.totalPrice}</div>
                        <span className="inline-block text-[10px] text-emerald-300 border border-emerald-500/30 bg-emerald-950/80 px-3 py-1 uppercase tracking-widest font-bold">
                          Payment Verified ✓
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to cancel this service booking?')) {
                              if (onDeleteBooking) onDeleteBooking(b.id);
                            }
                          }}
                          className="mt-2 text-[10px] text-red-400 hover:text-red-300 uppercase tracking-widest font-bold underline decoration-red-900/50 hover:decoration-red-400 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PREVIOUS SERVICES SECTION */}
            <div className="space-y-4 pt-4 border-t border-[#262636]">
              <div className="border-b border-[#262636] pb-3">
                <h2 className="text-xl font-light text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#d4af37]" /> Previous Services
                </h2>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mt-0.5">
                  Past service records — Rebook in 1-click
                </p>
              </div>

              <div className="space-y-4">
                {previousServices.map((ps) => (
                  <div key={ps.id} className="bg-[#121218] border border-[#262636] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#2a2a3a] transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 bg-[#181822] border border-[#2a2a3a] px-2.5 py-0.5 uppercase tracking-widest">
                          Completed: {ps.date}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                        {ps.serviceName}
                      </h3>

                      <p className="text-xs text-zinc-300">
                        Vehicle: {ps.vehicleName}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#d4af37] font-display">₹{ps.totalPrice}</div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Previous Paid</div>
                      </div>

                      <button
                        onClick={() => onOpenBooking(ps.serviceId, ps.carObj)}
                        className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-lg rounded-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Rebook Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Add / Edit Vehicle Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <div className="bg-[#121218] border border-[#d4af37]/40 p-6 sm:p-8 rounded-sm max-w-md w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddCarModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 bg-[#181822] border border-[#2a2a3a] rounded-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-light text-white font-display uppercase tracking-wider">
              {editingCarId ? 'Edit Vehicle' : 'Add Vehicle'} <span className="font-bold text-[#d4af37]">To My Garage</span>
            </h3>

            <form onSubmit={handleSaveCar} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Car Brand</label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. BMW, Honda, Mercedes"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:outline-none focus:border-[#d4af37] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Car Model</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 3 Series, City, C-Class"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:outline-none focus:border-[#d4af37] rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Reg Number</label>
                  <input
                    type="text"
                    required
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="KA01AB1234"
                    className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:outline-none focus:border-[#d4af37] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Car Year</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2023"
                    className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:outline-none focus:border-[#d4af37] rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">
                  Car Image File {editingCarId ? '(Optional if keeping existing)' : '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingCarId}
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-2 text-xs text-zinc-300 focus:outline-none rounded-sm file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#d4af37] file:text-black hover:file:bg-[#e5c158] cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCarModal(false)}
                  className="bg-[#181822] text-zinc-300 hover:text-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#d4af37] text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-lg rounded-sm"
                >
                  Save To Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
