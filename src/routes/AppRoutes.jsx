import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import PortfolioPage from '../pages/PortfolioPage';
import ContactPage from '../pages/ContactPage';
import NewsPage from '../pages/NewsPage';
import ScrollToTop from '../components/ScrollToTop';

// Admin Imports
import { AdminProvider } from '../admin/context/AdminContext';
import AuthGuard from '../admin/guards/AuthGuard';
import RoleGuard from '../admin/guards/RoleGuard';
import AdminLayout from '../admin/layouts/AdminLayout';
import AdminLogin from '../admin/pages/AdminLogin';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminUsers from '../admin/pages/AdminUsers';
import AdminProjects from '../admin/pages/AdminProjects';
import AdminServices from '../admin/pages/AdminServices';
import AdminMessages from '../admin/pages/AdminMessages';
import AdminTestimonials from '../admin/pages/AdminTestimonials';
import AdminNews from '../admin/pages/AdminNews';
import AdminSettings from '../admin/pages/AdminSettings';
import AdminAnalytics from '../admin/pages/AdminAnalytics';

const AdminWrapper = () => (
  <AdminProvider>
    <Outlet />
  </AdminProvider>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="news" element={<NewsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminWrapper />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="login" element={<AdminLogin />} />
          
          <Route element={<AuthGuard><AdminLayout /></AuthGuard>}>
            <Route path="dashboard" element={<RoleGuard requiredPermission="view_dashboard"><AdminDashboard /></RoleGuard>} />
            <Route path="users" element={<RoleGuard requiredPermission="view_users"><AdminUsers /></RoleGuard>} />
            <Route path="projects" element={<RoleGuard requiredPermission="view_projects"><AdminProjects /></RoleGuard>} />
            <Route path="services" element={<RoleGuard requiredPermission="view_services"><AdminServices /></RoleGuard>} />
            <Route path="messages" element={<RoleGuard requiredPermission="view_contacts"><AdminMessages /></RoleGuard>} />
            <Route path="testimonials" element={<RoleGuard requiredPermission="view_testimonials"><AdminTestimonials /></RoleGuard>} />
            <Route path="news" element={<RoleGuard requiredPermission="view_news"><AdminNews /></RoleGuard>} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<RoleGuard requiredPermission="view_analytics"><AdminAnalytics /></RoleGuard>} />
            
            {/* Catch-all for modules in progress */}
            <Route path="*" element={
              <div className="flex items-center justify-center h-[60vh] text-slate-500 font-bold uppercase tracking-widest italic opacity-50">
                Module Coming Soon...
              </div>
            } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
