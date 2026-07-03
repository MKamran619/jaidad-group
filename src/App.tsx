import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'

import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/public/HomePage'
import { PropertiesPage } from '@/pages/public/PropertiesPage'
import { PropertyDetailPage } from '@/pages/public/PropertyDetailPage'
import { ProjectsPage } from '@/pages/public/ProjectsPage'
import { ConstructionPage } from '@/pages/public/ConstructionPage'
import { GalleryPage } from '@/pages/public/GalleryPage'
import { BlogPage } from '@/pages/public/BlogPage'
import { BlogDetailPage } from '@/pages/public/BlogDetailPage'
import { ProjectDetailPage } from '@/pages/public/ProjectDetailPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'

import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminPropertiesPage } from '@/pages/admin/AdminPropertiesPage'
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage'
import { AdminConstructionPage } from '@/pages/admin/AdminConstructionPage'
import { AdminBlogsPage } from '@/pages/admin/AdminBlogsPage'
import { AdminInquiriesPage } from '@/pages/admin/AdminInquiriesPage'
import { AdminTestimonialsPage } from '@/pages/admin/AdminTestimonialsPage'
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <p className="font-display text-8xl font-black text-[var(--color-brand-gold)]">404</p>
      <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Page Not Found</h1>
      <p className="text-[var(--color-text-muted)]">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand-gold)] px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
        Back to Home
      </a>
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center px-4">
      <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">{title}</h1>
      <p className="text-[var(--color-text-muted)] text-sm">This page is under development.</p>
    </div>
  )
}

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">{title}</h1>
      <p className="text-[var(--color-text-muted)] text-sm">Module under development.</p>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="properties/:slug" element={<PropertyDetailPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectDetailPage />} />
              <Route path="construction" element={<ConstructionPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
              <Route path="terms" element={<PlaceholderPage title="Terms of Service" />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminPropertiesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="construction" element={<AdminConstructionPage />} />
              <Route path="blogs" element={<AdminBlogsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="messages" element={<AdminPlaceholder title="Messages" />} />
              <Route path="agents" element={<AdminPlaceholder title="Agents" />} />
              <Route path="analytics" element={<AdminPlaceholder title="Analytics" />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
