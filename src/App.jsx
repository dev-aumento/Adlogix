import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ReelsPage } from './pages/ReelsPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { IndustryDetailPage } from './pages/IndustryDetailPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Old `/category/blog/<slug>` links keep working by redirecting to the new `/blog/<slug>`. */
const BlogCategoryRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
};

export const App = () => {
  return (
    <CMSProvider>
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<ProjectDetailPage />} />
              <Route path="/reels" element={<ReelsPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/industries/:slug" element={<IndustryDetailPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              {/* The old WordPress category archive path, kept so existing links still land. */}
              <Route path="/category/blog" element={<Navigate to="/blog" replace />} />
              <Route path="/category/blog/:slug" element={<BlogCategoryRedirect />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </CMSProvider>
  );
};

export default App;
