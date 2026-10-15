import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { PageSections } from '../components/sections/PageSections';
import { usePageContent } from '../hooks/usePageContent';
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

// Default order. Keys must match the "home" entry in the plugin's section registry.
const homeSections = {
  hero: HeroSection,
  reels: ReelShowcase,
  studio: StudioSection,
  brands: BrandMarquee,
  services: ServicesOverview,
  projects: FeaturedProjects,
  industries: IndustriesSection,
  why: WhyAdlogix,
  process: ProcessTimeline,
  plans: GrowthPlansSection,
  testimonials: VideoTestimonials,
  aumento: AumentoCredibility,
  insights: InsightsSection,
  cta: ClosingCTA
};

export const HomePage = () => {
  const { content, order } = usePageContent('home');

  return (
    <>
      <SEOHead
        title="Adlogix | Creative Digital Marketing & Technology Agency"
        description="Adlogix combines bold creative, performance marketing, and smart technology to help ambitious brands grow, connect, and convert. Powered by Aumento Infoway."
        canonical="https://adlogix.agency/"
      />

      <div className="flex flex-col">
        <PageSections sections={homeSections} order={order} content={content} />
      </div>
    </>
  );
};
