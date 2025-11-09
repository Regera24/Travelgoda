import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, DashboardLayout } from '../layouts';
import { 
  HomePage, 
  ToursPage, 
  TourDetailPage,
  LoginPage,
  RegisterPage,
  CartPage,
  TourGuideListPage,
  TourGuideDetailPage,
  FinancialReportPage,
  CustomerSupportPage,
} from '../pages';
import {
  DestinationsPage,
  AboutPage,
  ContactPage,
  ProfilePage,
  BookingsPage,
  WishlistPage,
  CheckoutPage,
  NotFoundPage,
  DashboardHomePage,
  DashboardToursPage,
  DashboardBookingsPage,
  DashboardCustomersPage,
  DashboardSettingsPage,
  DashboardToursPendingPage,
} from '../pages/PlaceholderPages';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import TourManagement from '../pages/TourManagement';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'tours',
        element: <ToursPage />,
      },
      {
        path: '/tours/:id',
        element: <TourDetailPage />,
      },
      {
        path: 'destinations',
        element: <DestinationsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'wishlist',
        element: <WishlistPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'financial-report',
        element: <FinancialReportPage />,
      },
      {
        path: 'support',
        element: <CustomerSupportPage />,
      },
    ],
  },
  {
    path: '/tour-guide',
    element: <MainLayout />,
    children: [
      {
        path: 'tours',
        element: <TourGuideListPage />,
      },
      {
        path: 'tours/:tourId',
        element: <TourGuideDetailPage />,
      },
    ],
  },
  {
    path: 'admin/manage',
    element: (
        <DashboardLayout />
    ),
  },
  {
    path: '/dashboard',
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'tours',
        element: <DashboardToursPage />,
      },
      {
        path: 'tours2',
        element: <DashboardToursPendingPage />,
      },
      {
        path: 'bookings',
        element: <DashboardBookingsPage />,
      },
      {
        path: 'customers',
        element: <DashboardCustomersPage />,
      },
      {
        path: 'settings',
        element: <DashboardSettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
