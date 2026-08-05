import React, { useState, useEffect } from 'react';
import { INITIAL_CUSTOMER_CARS } from '../data/mockData';
import { CustomerCar, ServiceBooking, ServiceItem } from '../types';
import { X, CheckCircle2, Calendar, Clock, ArrowRight, ArrowLeft, QrCode, ShieldCheck, Upload, RotateCcw } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  preselectedCar?: CustomerCar;
  onAddBookingToState: (booking: ServiceBooking) => void;
  onNavigateToCustomerPortal: () => void;
  services: ServiceItem[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedCar,
  onAddBookingToState,
  onNavigateToCustomerPortal,
  services
}) => {
  const [step, setStep] = useState<number>(1);

  // Registered cars list
  const [registeredCars] = useState<CustomerCar[]>(INITIAL_CUSTOMER_CARS);
  const [selectedCar, setSelectedCar] = useState<CustomerCar>(preselectedCar || INITIAL_CUSTOMER_CARS[0]);

  // Selected services
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    preselectedServiceId ? [preselectedServiceId] : ['interior-cleaning', 'ceramic-coating']
  );

  // Date & Time Slot
  const [date, setDate] = useState('12 August 2026');
  const [timeSlot, setTimeSlot] = useState('3:00 PM');

  // Contact Info
  const [customerName] = useState('Alexander Vance');
  const [customerPhone] = useState('+91 98765 43210');
  const [customerEmail] = useState('alex.vance@vanceholdings.com');

  // Payment State
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');

  // Confirmed booking reference
  const [createdBooking, setCreatedBooking] = useState<ServiceBooking | null>(null);

  // CRITICAL FIX: Reset form every time modal opens or new booking request is made
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCreatedBooking(null);
      setTxnId('');
      setPaymentScreenshot(null);
      if (preselectedCar) {
        setSelectedCar(preselectedCar);
      } else {
        setSelectedCar(registeredCars[0] || INITIAL_CUSTOMER_CARS[0]);
      }
      if (preselectedServiceId) {
        setSelectedServiceIds([preselectedServiceId]);
      } else {
        setSelectedServiceIds(['interior-cleaning', 'ceramic-coating']);
      }
      setDate('12 August 2026');
      setTimeSlot('3:00 PM');
    }
  }, [isOpen, preselectedCar, preselectedServiceId, registeredCars]);

  if (!isOpen) return null;

  // Categorize services based on their categories so new custom services automatically appear
  const cleaningServices = services.filter(s => s.category === 'detailing' || s.category === 'interior');
  const protectionServices = services.filter(s => s.category === 'coating' || s.category === 'ppf');
  const modificationServices = services.filter(s => s.category === 'modification');

  const toggleServiceSelection = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length === 1) return; // Keep at least one
      setSelectedServiceIds(selectedServiceIds.filter(s => s !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  const selectedServicesList = services.filter(s => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServicesList.reduce((sum, s) => sum + s.startingPrice, 0);

  const resetForNewBooking = () => {
    setStep(1);
    setCreatedBooking(null);
    setTxnId('');
    setPaymentScreenshot(null);
    setSelectedServiceIds(['interior-cleaning', 'ceramic-coating']);
  };

  const handleConfirmPayment = () => {
    const serviceNamesString = selectedServicesList.map(s => s.name).join(', ');
    const newBooking: ServiceBooking = {
      id: `b-${Date.now()}`,
      bookingNumber: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerEmail,
      serviceType: 'studio',
      serviceId: selectedServiceIds[0],
      serviceName: serviceNamesString,
      carDetails: {
        make: selectedCar.make,
        model: selectedCar.model,
        year: selectedCar.year,
        color: selectedCar.color || 'Standard',
        licensePlate: selectedCar.licensePlate,
        carType: `${selectedCar.make} ${selectedCar.model}`
      },
      addOns: [],
      date,
      timeSlot,
      totalPrice,
      status: 'Confirmed',
      assignedBay: 'Clean Room Bay #1',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCreatedBooking(newBooking);
    onAddBookingToState(newBooking);
    setStep(6);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
      <div className="bg-[#121218] border border-[#262636] rounded-sm max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl my-auto text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 bg-[#1c1c28] border border-[#2a2a3c] rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Progress Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#262636] pb-4 pr-10 sm:pr-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-light text-white font-display uppercase tracking-wider">
                Book <span className="font-bold text-[#d4af37]">Car Service</span>
              </h3>
              <p className="text-[11px] text-[#e5c158] font-bold uppercase tracking-widest mt-1">
                Step {step} of 6 — {
                  step === 1 ? 'Select Vehicle' :
                  step === 2 ? 'Choose Required Services' :
                  step === 3 ? 'Select Date & Time Slot' :
                  step === 4 ? 'Booking Summary' :
                  step === 5 ? 'Payment through QR' : 'Booking Confirmation'
                }
              </p>
            </div>

            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div 
                  key={s} 
                  className={`w-6 h-1.5 transition-all ${
                    s === step ? 'bg-[#d4af37]' : s < step ? 'bg-[#d4af37]/40' : 'bg-[#222230]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEP 1: SELECT VEHICLE */}
        {step === 1 && (
          <div className="space-y-6">
            <label className="block text-xs font-bold text-zinc-200 uppercase tracking-widest font-display">
              Choose Vehicle From Your Garage
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              {registeredCars.map((car) => {
                const isSelected = selectedCar.id === car.id;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => setSelectedCar(car)}
                    className={`p-4 text-left space-y-3 transition-all rounded-sm border ${
                      isSelected
                        ? 'bg-[#1e1c15] border-[#d4af37] text-white shadow-xl ring-1 ring-[#d4af37]'
                        : 'bg-[#181820] border-[#2a2a3a] text-zinc-300 hover:bg-[#20202c]'
                    }`}
                  >
                    <div className="relative h-28 overflow-hidden rounded-sm border border-[#2a2a3a]">
                      <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#d4af37] text-black p-1 shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-display uppercase tracking-wider">{car.make} {car.model}</h4>
                      <p className="text-[11px] text-[#d4af37] font-mono mt-0.5">Reg: {car.licensePlate}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262636]">
              <span className="text-xs text-zinc-400">Selected: <strong className="text-white">{selectedCar.make} {selectedCar.model}</strong></span>
              <button
                onClick={() => setStep(2)}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg"
              >
                <span>Select Services</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SERVICES */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-xs text-zinc-300 uppercase tracking-wider">
              Select one or more required services for <strong className="text-[#d4af37]">{selectedCar.make} {selectedCar.model}</strong>:
            </p>

            {/* Cleaning */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-[#262636] pb-1 font-display">
                Cleaning
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {cleaningServices.map((s) => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleServiceSelection(s.id)}
                      className={`p-3.5 rounded-sm border text-left text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isChecked ? 'bg-[#1e1c15] border-[#d4af37] text-white shadow-md' : 'bg-[#181820] border-[#2a2a3a] text-zinc-300 hover:bg-[#20202c]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 accent-[#d4af37] pointer-events-none"
                        />
                        <span className="font-semibold">{s.name}</span>
                      </div>
                      <span className="font-bold text-[#d4af37]">₹{s.startingPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Protection */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-[#262636] pb-1 font-display">
                Protection
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {protectionServices.map((s) => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleServiceSelection(s.id)}
                      className={`p-3.5 rounded-sm border text-left text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isChecked ? 'bg-[#1e1c15] border-[#d4af37] text-white shadow-md' : 'bg-[#181820] border-[#2a2a3a] text-zinc-300 hover:bg-[#20202c]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 accent-[#d4af37] pointer-events-none"
                        />
                        <span className="font-semibold">{s.name}</span>
                      </div>
                      <span className="font-bold text-[#d4af37]">₹{s.startingPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modification */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest border-b border-[#262636] pb-1 font-display">
                Modification
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {modificationServices.map((s) => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleServiceSelection(s.id)}
                      className={`p-3.5 rounded-sm border text-left text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isChecked ? 'bg-[#1e1c15] border-[#d4af37] text-white shadow-md' : 'bg-[#181820] border-[#2a2a3a] text-zinc-300 hover:bg-[#20202c]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 accent-[#d4af37] pointer-events-none"
                        />
                        <span className="font-semibold">{s.name}</span>
                      </div>
                      <span className="font-bold text-[#d4af37]">₹{s.startingPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262636]">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Total</span>
                  <span className="text-xl font-bold text-[#d4af37] font-display">₹{totalPrice}</span>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg"
                >
                  <span>Select Date & Time</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE & TIME SLOT */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-1.5 font-display">
                <Calendar className="w-4 h-4 text-[#d4af37]" /> Select Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="12 August 2026"
                className="w-full bg-[#181822] border border-[#2a2a3a] p-3.5 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5 font-display">
                <Clock className="w-4 h-4 text-[#d4af37]" /> Select Available Time Slot
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'].map((slot) => {
                  const isSelected = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-3.5 rounded-sm border text-center text-xs font-bold tracking-wider transition-all ${
                        isSelected
                          ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-lg font-extrabold'
                          : 'bg-[#181820] text-zinc-300 border-[#2a2a3a] hover:bg-[#20202c]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262636]">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg"
              >
                <span>View Summary</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BOOKING SUMMARY */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-[#181822] border border-[#d4af37]/30 p-6 rounded-sm space-y-4">
              <h4 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest border-b border-[#2a2a3a] pb-3 font-display">
                Booking Summary
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-[#262636] pb-2">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Vehicle:</span>
                  <span className="font-bold text-white">{selectedCar.make} {selectedCar.model} ({selectedCar.licensePlate})</span>
                </div>

                <div className="flex justify-between border-b border-[#262636] pb-2">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Selected Services:</span>
                  <span className="font-bold text-[#e5c158] text-right">
                    {selectedServicesList.map(s => s.name).join(', ')}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#262636] pb-2">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Date:</span>
                  <span className="font-bold text-white">{date}</span>
                </div>

                <div className="flex justify-between border-b border-[#262636] pb-2">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Time Slot:</span>
                  <span className="font-bold text-white">{timeSlot}</span>
                </div>

                <div className="pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Total Amount Payable:</span>
                  <span className="text-3xl font-black text-[#d4af37] font-display">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262636]">
              <button
                onClick={() => setStep(3)}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xl"
              >
                <span>Proceed To Payment</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT PAGE (QR PAYMENT) */}
        {step === 5 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-wider">
                Scan & Pay via UPI QR Code
              </h4>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">
                Scan with GPay, PhonePe, Paytm or any UPI App
              </p>
            </div>

            <div className="max-w-xs mx-auto bg-[#181822] p-6 rounded-sm border border-[#d4af37]/40 space-y-4">
              <div className="text-xs text-zinc-300 uppercase tracking-widest">
                Amount Payable: <span className="text-xl font-black text-[#d4af37] font-display ml-1">₹{totalPrice}</span>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 inline-block rounded-sm shadow-2xl">
                <QrCode className="w-40 h-40 text-black mx-auto" />
              </div>

              <div className="text-xs text-zinc-200 font-mono bg-[#0c0c10] p-2.5 border border-[#2a2a3a]">
                UPI ID: <strong className="text-[#d4af37] font-bold">darpex@upi</strong>
              </div>
            </div>

            {/* Payment Proof Upload / Txn ID */}
            <div className="max-w-md mx-auto space-y-3 text-left">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest">
                Enter UPI Txn ID or Upload Screenshot
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="e.g. UPI Ref / UTR No. 4209181283"
                  className="flex-1 bg-[#181822] border border-[#2a2a3a] p-3 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setPaymentScreenshot('screenshot_uploaded.jpg')}
                  className={`px-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border transition-all rounded-sm ${
                    paymentScreenshot ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500' : 'bg-[#181822] text-zinc-300 border-[#2a2a3a] hover:bg-[#20202c]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  {paymentScreenshot ? 'Uploaded' : 'Upload'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262636]">
              <button
                onClick={() => setStep(4)}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleConfirmPayment}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xl"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Payment</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: BOOKING CONFIRMATION */}
        {step === 6 && createdBooking && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-black mx-auto flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-light text-white font-display uppercase tracking-wider">
                Service Booked <span className="font-bold text-emerald-400">Successfully</span>
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto uppercase tracking-wider">
                Your service appointment has been reserved and confirmed.
              </p>
            </div>

            {/* Confirmation Card */}
            <div className="max-w-md mx-auto bg-[#181822] p-6 rounded-sm border border-[#d4af37]/40 space-y-4 text-left shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-widest font-display">DARPEX BOOKING</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-1 border border-emerald-500/40 uppercase tracking-widest font-bold">
                  CONFIRMED
                </span>
              </div>

              <div className="text-xs text-zinc-300 space-y-2">
                <div><strong className="text-white uppercase tracking-wider text-[10px]">Booking ID:</strong> <span className="text-[#d4af37] font-mono font-bold">{createdBooking.bookingNumber}</span></div>
                <div><strong className="text-white uppercase tracking-wider text-[10px]">Vehicle:</strong> {createdBooking.carDetails.make} {createdBooking.carDetails.model}</div>
                <div><strong className="text-white uppercase tracking-wider text-[10px]">Services:</strong> {createdBooking.serviceName}</div>
                <div><strong className="text-white uppercase tracking-wider text-[10px]">Date:</strong> {createdBooking.date}</div>
                <div><strong className="text-white uppercase tracking-wider text-[10px]">Time:</strong> {createdBooking.timeSlot}</div>
                <div><strong className="text-white uppercase tracking-wider text-[10px]">Total Paid:</strong> ₹{createdBooking.totalPrice}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToCustomerPortal();
                }}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                View My Bookings
              </button>

              <button
                onClick={resetForNewBooking}
                className="bg-[#181822] hover:bg-[#20202c] text-white border border-[#2a2a3a] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
                Book Another Service
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
