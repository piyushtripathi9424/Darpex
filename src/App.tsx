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

import { INITIAL_BOOKINGS, SERVICES_DATA } from './data/mockData';
import { ServiceBooking, CustomerCar, ServiceItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard'>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
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
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: ServiceBooking['status']) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const handleUpdateBookingSlot = (bookingId: string, newDate: string, newSlot: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, date: newDate, timeSlot: newSlot } : b));
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
  };

  return (
    <div className="min-h-screen bg-[#08080a] luxury-gradient text-white flex flex-col font-sans">
      
      {/* Navigation Header */}
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
        {currentView === 'home' && (
          <>
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
          </>
        )}

        {currentView === 'garage' && currentUser && (
          <CustomerDashboard
            bookings={bookings}
            onOpenBooking={(serviceId, car) => handleOpenBooking(serviceId, car)}
            defaultSubTab="garage"
            userName={currentUser.name}
          />
        )}

        {currentView === 'my-services' && currentUser && (
          <CustomerDashboard
            bookings={bookings}
            onOpenBooking={(serviceId, car) => handleOpenBooking(serviceId, car)}
            defaultSubTab="services"
            userName={currentUser.name}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLogin
            onAdminLoginSuccess={() => setCurrentView('admin-dashboard')}
            onBackToCustomer={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard 
            services={services}
            setServices={setServices}
            bookings={bookings} 
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateBookingSlot={handleUpdateBookingSlot}
            onAdminLogout={() => {
              setCurrentUser(null);
              setCurrentView('home');
            }} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateToSection={handleNavigateToSection}
        setCurrentView={handleGuardedViewNavigation}
        onOpenBooking={() => handleOpenBooking()}
        user={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Mobile Sticky Booking Bar */}
      <MobileStickyBookingBar
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Booking Modal Flow */}
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)}
          preselectedServiceId={preselectedServiceId}
          preselectedCar={preselectedCar}
          onAddBookingToState={(booking) => {
            setBookings([booking, ...bookings]);
          }}
          onNavigateToCustomerPortal={() => handleGuardedViewNavigation('my-services')}
          services={services}
        />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
