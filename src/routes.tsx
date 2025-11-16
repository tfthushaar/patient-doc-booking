import Home from './pages/Home';
import Login from './pages/Login';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import AllAppointments from './pages/admin/AllAppointments';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: true
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  },
  {
    name: 'Doctors',
    path: '/doctors',
    element: <Doctors />,
    visible: true
  },
  {
    name: 'Book Appointment',
    path: '/book-appointment/:doctorId',
    element: <BookAppointment />,
    visible: false
  },
  {
    name: 'My Appointments',
    path: '/my-appointments',
    element: <MyAppointments />,
    visible: true
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false
  },
  {
    name: 'Manage Doctors',
    path: '/admin/doctors',
    element: <ManageDoctors />,
    visible: false
  },
  {
    name: 'Manage Users',
    path: '/admin/users',
    element: <ManageUsers />,
    visible: false
  },
  {
    name: 'All Appointments',
    path: '/admin/appointments',
    element: <AllAppointments />,
    visible: false
  }
];

export default routes;