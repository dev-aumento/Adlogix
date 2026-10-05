import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { HeroSection } from '../components/home/HeroSection';
import { ReelShowcase } from '../components/home/ReelShowcase';
import { StudioSection } from '../components/home/StudioSection';
import { BrandMarquee } from '../components/home/BrandMarquee';
import { ServicesOverview } from '../components/home/ServicesOverview';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { IndustriesSection } from '../components/home/IndustriesSection';
import { WhyAdlogix } from '../components/home/WhyAdlogix';
import { ProcessTimeline } from '../components/home/ProcessTimeline';
import { GrowthPlansSection } from '../components/home/GrowthPlansSection';
import { VideoTestimonials } from '../components/home/VideoTestimonials';
import { AumentoCredibility } from '../components/home/AumentoCredibility';
import { InsightsSection } from '../components/home/InsightsSection';
import { ClosingCTA } from '../components/home/ClosingCTA';

export const HomePage = () => {
  return (
    <>
      <SEOHead
        title="Adlogix | Creative Digital Marketing & Technology Agency"
        description="Adlogix combines bold creative, performance marketing, and smart technology to help ambitious brands grow, connect, and convert. Powered by Aumento Infoway."
        canonical="https://adlogix.agency/"
      />

      <div className="flex flex-col">
        {/* Section 2: Hero */}
        <HeroSection />

        {/* Section 3: Client Reels & Creative Showcase */}
        <ReelShowcase />

        {/* Section 3.5: Studio Adlogix & Infinite Fashion/Product Loop */}
        <StudioSection />

        {/* Section 4: Brand Marquee */}
        <BrandMarquee />

        {/* Section 5: Services Overview */}
        <ServicesOverview />

        {/* Section 6: Featured Projects & Case Studies */}
        <FeaturedProjects />

        {/* Section 7: Industries We Work With */}
        <IndustriesSection />

        {/* Section 8: Why Adlogix */}
        <WhyAdlogix />

        {/* Section 9: Our Process */}
        <ProcessTimeline />

        {/* Section 10: Growth Plans & Regular Package Options */}
        <GrowthPlansSection />

        {/* Section 11: Client Video Testimonials */}
        <VideoTestimonials />

        {/* Section 12: Powered by Aumento Infoway Credibility */}
        <AumentoCredibility />

        {/* Section 13: Insights & Resources */}
        <InsightsSection />

        {/* Section 14: Conversion-Focused Closing CTA */}
        <ClosingCTA />
      </div>
    </>
  );
};
