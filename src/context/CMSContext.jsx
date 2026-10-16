import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { defaultSiteSettings } from '../data/siteSettings';
import { defaultHeader, defaultFooter, defaultFooterMenus } from '../content/layout';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { clientReelsData } from '../data/reelsData';
import { testimonialsData } from '../data/testimonialsData';
import { industriesData } from '../data/industriesData';
import { blogsData } from '../data/blogsData';
import { teamData } from '../data/teamData';

export const CMSContext = createContext(null);

// WordPress testimonials reference their case study by post ID ("Related case study").
const linkTestimonialsToProjects = (testimonials, projects) => {
  const slugById = new Map(projects.filter((p) => p.wpId).map((p) => [p.wpId, p.slug]));
  return testimonials.map((t) => (t.projectId ? { ...t, projectSlug: slugById.get(t.projectId) || '' } : t));
};

export const CMSProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [header, setHeader] = useState(defaultHeader);
  const [footer, setFooter] = useState(defaultFooter);
  const [footerMenus, setFooterMenus] = useState(defaultFooterMenus);
  const [services, setServices] = useState(servicesData);
  const [projects, setProjects] = useState(projectsData);
  const [reels, setReels] = useState(clientReelsData);
  const [testimonials, setTestimonials] = useState(testimonialsData);
  const [industries, setIndustries] = useState(industriesData);
  const [blogs, setBlogs] = useState(blogsData);
  const [team, setTeam] = useState(teamData);
  const [isLoading, setIsLoading] = useState(true);

  // Global Video Modal State
  const [activeVideo, setActiveVideo] = useState(null);

  // Global Discovery Modal State
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAllContent = async () => {
      try {
        const [
          fetchedSettings,
          fetchedLayout,
          fetchedServices,
          fetchedProjects,
          fetchedReels,
          fetchedTestimonials,
          fetchedIndustries,
          fetchedBlogs,
          fetchedTeam
        ] = await Promise.all([
          api.getSettings(),
          api.getLayout(),
          api.getServices(),
          api.getProjects(),
          api.getReels(),
          api.getTestimonials(),
          api.getIndustries(),
          api.getBlogs(),
          api.getTeam()
        ]);

        if (isMounted) {
          setSettings({
            ...defaultSiteSettings,
            ...fetchedSettings,
            navigation: fetchedLayout.navigation,
          });
          setHeader(fetchedLayout.header);
          setFooter(fetchedLayout.footer);
          setFooterMenus(fetchedLayout.footerMenus);
          setServices(fetchedServices);
          setProjects(fetchedProjects);
          setReels(fetchedReels);
          setTestimonials(linkTestimonialsToProjects(fetchedTestimonials, fetchedProjects));
          setIndustries(fetchedIndustries);
          setBlogs(fetchedBlogs);
          setTeam(fetchedTeam);
        }
      } catch (err) {
        console.warn("[CMS Provider] Error loading content from CMS, defaulting to local cache:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAllContent();
    return () => { isMounted = false; };
  }, []);

  const openVideoModal = (videoData) => {
    setActiveVideo(videoData);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
    document.body.style.overflow = 'unset';
  };

  const openDiscoveryModal = () => {
    setIsDiscoveryModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDiscoveryModal = () => {
    setIsDiscoveryModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const value = {
    settings,
    header,
    footer,
    footerMenus,
    services,
    projects,
    reels,
    testimonials,
    industries,
    blogs,
    team,
    isLoading,
    activeVideo,
    openVideoModal,
    closeVideoModal,
    isDiscoveryModalOpen,
    openDiscoveryModal,
    closeDiscoveryModal
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};
