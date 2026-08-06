import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { AboutAndContactSection } from './components/AboutAndContactSection';
import { BookingModal } from './components/BookingModal';
import { LoginModal } from './components/LoginModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
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

import { INITIAL_BOOKINGS, SERVICES_DATA, INITIAL_CUSTOMER_CARS } from './data/mockData';
import { ServiceBooking, CustomerCar, ServiceItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard'>('home');
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
  const [bookings, setBookings] = useState<ServiceBooking[]>(INITIAL_BOOKINGS);

  // Global Cars State
  const [cars, setCars] = useState<CustomerCar[]>(INITIAL_CUSTOMER_CARS);

  // Global Services State
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);

  // Protected Routes Guard Effect: Redirect immediately to home if on private view without auth
  useEffect(() => {
    if (!currentUser && (currentView === 'garage' || currentView === 'my-services')) {
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'home' }, '', '/');
      }
    }
  }, [currentUser, currentView]);

  // Handle browser back/forward buttons to prevent returning to protected pages after logout
  useEffect(() => {
    const handlePopState = () => {
      const saved = localStorage.getItem('user_session');
      if (!saved && (currentView === 'garage' || currentView === 'my-services')) {
        setCurrentUser(null);
        setCurrentView('home');
        if (typeof window !== 'undefined') {
          window.history.replaceState({ view: 'home' }, '', '/');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

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

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
    toast('Booking has been removed successfully.', 'info');
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
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

  const handleLoginSuccess = (user: { name: string; emailOrPhone: string }) => {
    try {
      localStorage.setItem('user_session', JSON.stringify(user));
      localStorage.setItem('jwt_token', `token_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    } catch (err) {
      console.error('Failed to store session in localStorage:', err);
    }
    setCurrentUser(user);
    setIsLoginOpen(false);
    setCurrentView('garage');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'garage' }, '', '/dashboard');
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
          <main className="flex-1">
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
                    userName={currentUser.name}
                    cars={cars}
                    setCars={setCars}
                  />
                </PageTransition>
              )}

              {currentView === 'admin-login' && (
                <PageTransition key="admin-login">
                  <AdminLogin
                    onAdminLoginSuccess={() => setCurrentView('admin-dashboard')}
                    onBackToCustomer={() => setCurrentView('home')}
                  />
                </PageTransition>
              )}

              {currentView === 'admin-dashboard' && (
                <PageTransition key="admin-dashboard">
                  <AdminDashboard 
                    services={services}
                    setServices={setServices}
                    bookings={bookings} 
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                    onUpdateBookingSlot={handleUpdateBookingSlot}
                    onDeleteBooking={handleDeleteBooking}
                    onAdminLogout={() => {
                      setCurrentUser(null);
                      setCurrentView('home');
                    }} 
                  />
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
            onNavigateToCustomerPortal={() => handleNavigateToSection('my-services')}
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
            isVisible={!isBookingOpen && !isLoginOpen && currentView !== 'admin-dashboard'} 
          />
        </>
      )}
      </div>
    </SmoothScroll>
  );
}
