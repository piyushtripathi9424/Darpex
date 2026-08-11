import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { AboutAndContactSection } from './components/AboutAndContactSection';
import { BookingModal } from './components/BookingModal';
import { LoginModal } from './components/LoginModal';
import { CustomerDashboard } from './components/CustomerDashboard';
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminLogin = lazy(() => import('./components/AdminLogin').then(module => ({ default: module.AdminLogin })));
import { MobileStickyBookingBar } from './components/MobileStickyBookingBar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { BrandMarquee } from './components/BrandMarquee';
import { SmoothScroll } from './components/SmoothScroll';
import { useToast } from './components/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

import { SERVICES_DATA, INITIAL_CUSTOMER_CARS } from './data/mockData';
import { getMe } from './api/auth';
import { ServiceItem, CustomerCar, ServiceBooking } from './types';
import { BookingResponse, getBookings, cancelBooking } from './api/bookings';
import { getServices } from './api/services';
import { getVehicles } from './api/vehicles';

export default function App() {
  const getInitialView = () => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/my-garage') return 'garage';
    if (path === '/my-services') return 'my-services';
    if (path === '/admin/login') return 'admin-login';
    if (path === '/admin/dashboard') return 'admin-dashboard';
    return 'home';
  };

  const [currentView, setCurrentView] = useState<'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard'>(getInitialView);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoaded(true);
    }, 2000); // Wait for initial loader
    return () => clearTimeout(timer);
  }, []);
  
  // User Authentication State loaded from session storage
  const [currentUser, setCurrentUser] = useState<{ name: string; emailOrPhone: string } | null>(() => {
    try {
      const saved = localStorage.getItem('user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [preselectedCar, setPreselectedCar] = useState<CustomerCar | undefined>(undefined);

  // Global Bookings State
  const [bookings, setBookings] = useState<any[]>([]);

  // Global Cars State
  const [cars, setCars] = useState<CustomerCar[]>([]);

  // Global Services State
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);

  const loadCars = async () => {
    try {
      const data = await getVehicles();
      const formattedCars: CustomerCar[] = data.map(v => ({
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
      }));
      setCars(formattedCars);
    } catch (error) {
      console.error('Failed to load garage vehicles', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadBookings();
      loadCars();
      
      // Auto-sync profile to fix any stale localStorage data (e.g. missing names)
      getMe().then(res => {
        if (res?.profile && res.profile.name !== currentUser.name) {
          const updatedUser = { ...currentUser, name: res.profile.name };
          setCurrentUser(updatedUser);
          localStorage.setItem('user_session', JSON.stringify(updatedUser));
        }
      }).catch(err => console.error('Failed to sync user profile:', err));
    } else {
      setBookings([]);
      setCars([]); // Clear cars if not logged in
    }
  }, []); // Only run once on mount or when auth state drastically changes, but we'll stick to mount to prevent infinite loops, wait, we need it on currentUser change? No, just once or when currentUser is set. Let's just run it when currentUser.emailOrPhone changes or on mount.
  
  useEffect(() => {
    if (currentUser) {
      loadBookings();
      loadCars();
    } else {
      setBookings([]);
      setCars([]);
    }
  }, [currentUser?.emailOrPhone]);

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      const mappedBookings = data.map((b: any) => ({
        id: b.id,
        bookingNumber: b.booking_number || b.bookingNumber,
        customerName: currentUser?.name || 'Customer',
        customerPhone: currentUser?.emailOrPhone || '',
        customerEmail: currentUser?.emailOrPhone || '',
        serviceType: 'studio',
        serviceId: b.services?.[0]?.id || '',
        serviceName: (b.services || []).map((s: any) => s?.name).filter(Boolean).join(', '),
        carDetails: b.vehicle || {},
        addOns: [],
        date: b.date,
        timeSlot: b.time_slot || b.timeSlot,
        totalPrice: b.total_amount || b.totalPrice,
        status: b.status,
        assignedBay: 'Clean Room Bay #1',
        createdAt: b.created_at || b.createdAt
      }));
      setBookings(mappedBookings);
    } catch (error) {
      console.error('Failed to load bookings', error);
    }
  };
  
  useEffect(() => {
    const fetchLiveServices = async () => {
      try {
        const liveServices = await getServices();
        if (liveServices && liveServices.length > 0) {
          const formattedServices: ServiceItem[] = liveServices.map(s => ({
            id: s.id,
            name: s.name,
            category: (s.category.toLowerCase() === 'cleaning' ? 'detailing' : s.category.toLowerCase() === 'protection' ? 'coating' : 'modification') as any,
            startingPrice: s.price,
            shortDescription: s.description || 'Premium auto care service.',
            fullDescription: s.description || 'Experience the best premium auto care service for your vehicle.',
            duration: '2-4 hours',
            warranty: 'None',
            features: ['Premium Materials', 'Expert Technicians', 'Quality Guarantee'],
            processSteps: [],
            popular: s.name.includes('Ceramic') || s.name.includes('Detailing'),
            image: s.image_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80'
          }));
          setServices(formattedServices);
        }
      } catch (error) {
        console.error('Failed to fetch services. Using fallback mock data.', error);
      }
    };
    fetchLiveServices();
  }, []);

  // Protected Routes Guard Effect: Redirect immediately to home if on private view without auth
  useEffect(() => {
    if (!currentUser && (currentView === 'garage' || currentView === 'my-services')) {
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'home' }, '', '/');
      }
    }
  }, [currentUser, currentView]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      let nextView: 'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard' = 'home';
      
      if (path === '/my-garage') nextView = 'garage';
      else if (path === '/my-services') nextView = 'my-services';
      else if (path === '/admin/login') nextView = 'admin-login';
      else if (path === '/admin/dashboard') nextView = 'admin-dashboard';

      const saved = localStorage.getItem('user_session');
      if (!saved && (nextView === 'garage' || nextView === 'my-services')) {
        setCurrentUser(null);
        setCurrentView('home');
        if (typeof window !== 'undefined') {
          window.history.replaceState({ view: 'home' }, '', '/');
        }
      } else {
        setCurrentView(nextView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGuardedViewNavigation = (view: 'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard') => {
    if ((view === 'garage' || view === 'my-services') && !currentUser) {
      setCurrentView('home');
      setIsLoginOpen(true);
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'home' }, '', '/login');
      }
      return;
    }

    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const pathMap: Record<string, string> = {
        'home': '/',
        'garage': '/my-garage',
        'my-services': '/my-services',
        'admin-login': '/admin/login',
        'admin-dashboard': '/admin/dashboard'
      };
      window.history.pushState({ view }, '', pathMap[view] || '/');
    }
  };

  const handleOpenBooking = (serviceId?: string, car?: CustomerCar) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'home' }, '', '/login');
      }
      return;
    }
    setPreselectedServiceId(serviceId);
    setPreselectedCar(car);
    setIsBookingOpen(true);
  };

  const handleAddBookingToState = (newBooking: ServiceBooking) => {
    setBookings([newBooking, ...bookings]);
    toast(`Successfully booked ${newBooking.serviceName} for ${newBooking.carDetails.make}`, 'success');
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: ServiceBooking['status']) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const handleUpdateBookingSlot = (bookingId: string, newDate: string, newSlot: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, date: newDate, timeSlot: newSlot } : b));
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast('Booking has been cancelled successfully.', 'info');
    } catch (error) {
      console.error('Failed to cancel booking', error);
      toast('Failed to cancel booking', 'error');
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      handleGuardedViewNavigation('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
      }, 400);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    }
  };

  const handleLoginSuccess = (user: { name: string; emailOrPhone: string }, token: string) => {
    try {
      localStorage.setItem('user_session', JSON.stringify(user));
      localStorage.setItem('jwt_token', token);
    } catch (err) {
      console.error('Failed to store session in localStorage:', err);
    }
    setCurrentUser(user);
    setIsLoginOpen(false);
    
    // Set view directly instead of using handleGuardedViewNavigation 
    // to avoid stale closure (currentUser === null) triggering the auth guard
    setCurrentView('garage');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'garage' }, '', '/my-garage');
    }
    
    toast(`Welcome back, ${user.name}!`, 'info');
  };

  const handleLogout = () => {
    // 1. Clear session and tokens
    try {
      localStorage.removeItem('user_session');
      localStorage.removeItem('jwt_token');
      sessionStorage.clear();
    } catch (err) {
      console.error('Error clearing session:', err);
    }

    // 2. Clear current user state
    setCurrentUser(null);
    setIsBookingOpen(false);
    setIsLoginOpen(false);

    // 3. Immediately redirect user to public homepage
    setCurrentView('home');

    // 4. Overwrite history state so browser back button cannot return to dashboard
    if (typeof window !== 'undefined') {
      window.history.replaceState({ view: 'home' }, '', '/');
    }
    toast('You have successfully logged out.', 'info');
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#08080a] luxury-gradient text-white flex flex-col font-sans noise-overlay">
        <PageLoader isLoading={!isAppLoaded} />
      
      {isAppLoaded && (
        <>

          <Navbar
            currentView={currentView}
            setCurrentView={handleGuardedViewNavigation}
            onOpenBooking={() => handleOpenBooking()}
            onOpenLogin={() => setIsLoginOpen(true)}
            onNavigateToSection={handleNavigateToSection}
            user={currentUser}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1 pb-20 lg:pb-0">
            <AnimatePresence mode="wait">
              {currentView === 'home' && (
                <PageTransition key="home">
                  <Hero
                    onOpenBooking={() => handleOpenBooking()}
                    onNavigateToSection={handleNavigateToSection}
                  />

                  <ServicesSection services={services} onOpenBooking={handleOpenBooking} />

                  <TrustSection />

                  <BeforeAfterGallery />

                  <AboutAndContactSection
                    onOpenBooking={() => handleOpenBooking()}
                  />
                </PageTransition>
              )}

              {currentView === 'garage' && currentUser && (
                <PageTransition key="garage">
                  <CustomerDashboard
                    bookings={bookings}
                    onOpenBooking={(serviceId, car) => handleOpenBooking(serviceId, car)}
                    onDeleteBooking={handleDeleteBooking}
                    defaultSubTab="garage"
                    onTabChange={(tab) => handleGuardedViewNavigation(tab === 'garage' ? 'garage' : 'my-services')}
                    userName={currentUser.name}
                    cars={cars}
                    setCars={setCars}
                  />
                </PageTransition>
              )}

              {currentView === 'my-services' && currentUser && (
                <PageTransition key="my-services">
                  <CustomerDashboard
                    bookings={bookings}
                    onOpenBooking={(serviceId, car) => handleOpenBooking(serviceId, car)}
                    onDeleteBooking={handleDeleteBooking}
                    defaultSubTab="services"
                    onTabChange={(tab) => handleGuardedViewNavigation(tab === 'garage' ? 'garage' : 'my-services')}
                    userName={currentUser.name}
                    cars={cars}
                    setCars={setCars}
                  />
                </PageTransition>
              )}

              {currentView === 'admin-login' && (
                <PageTransition key="admin-login">
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#090A0E] text-[#d4af37]">Loading...</div>}>
                    <AdminLogin
                      onAdminLoginSuccess={() => handleGuardedViewNavigation('admin-dashboard')}
                      onBackToCustomer={() => {}} // Disabled cross-navigation
                    />
                  </Suspense>
                </PageTransition>
              )}

              {currentView === 'admin-dashboard' && (
                <PageTransition key="admin-dashboard">
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#090A0E] text-[#d4af37]">Loading...</div>}>
                    <AdminDashboard 
                      services={services}
                      setServices={setServices}
                      bookings={bookings} 
                      onUpdateBookingStatus={handleUpdateBookingStatus}
                      onUpdateBookingSlot={handleUpdateBookingSlot}
                      onDeleteBooking={handleDeleteBooking}
                      onAdminLogout={() => {
                        localStorage.removeItem('admin_session');
                        localStorage.removeItem('admin_jwt_token');
                        handleGuardedViewNavigation('admin-login');
                      }} 
                    />
                  </Suspense>
                </PageTransition>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer 
            onNavigateToSection={handleNavigateToSection} 
            setCurrentView={handleGuardedViewNavigation}
            onOpenBooking={() => handleOpenBooking()}
            onOpenLogin={() => setIsLoginOpen(true)}
            user={currentUser}
          />

          {/* Booking Modal Flow */}
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            preselectedServiceId={preselectedServiceId}
            preselectedCar={preselectedCar}
            onAddBookingToState={handleAddBookingToState}
            onNavigateToCustomerPortal={() => {
              setIsBookingOpen(false);
              handleGuardedViewNavigation('my-services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            services={services}
            cars={cars}
          />

          {/* Login Modal */}
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />

          {/* Mobile Booking Bar */}
          <MobileStickyBookingBar 
            onOpenBooking={() => handleOpenBooking()} 
            isVisible={!isBookingOpen && !isLoginOpen && currentView === 'home'} 
          />
        </>
      )}
      </div>
    </SmoothScroll>
  );
}
