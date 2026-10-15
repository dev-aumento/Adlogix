import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { defaultSiteSettings } from '../data/siteSettings';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { clientReelsData } from '../data/reelsData';
import { testimonialsData } from '../data/testimonialsData';
import { industriesData } from '../data/industriesData';
import { blogsData } from '../data/blogsData';
import { teamData } from '../data/teamData';

export const CMSContext = createContext(null);

export const CMSProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSiteSettings);
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
          fetchedServices,
          fetchedProjects,
          fetchedReels,
          fetchedTestimonials,
          fetchedIndustries,
          fetchedBlogs,
          fetchedTeam
        ] = await Promise.all([
          api.getSettings(),
          api.getServices(),
          api.getProjects(),
          api.getReels(),
          api.getTestimonials(),
          api.getIndustries(),
          api.getBlogs(),
          api.getTeam()
        ]);

        if (isMounted) {
          setSettings(fetchedSettings);
          setServices(fetchedServices);
          setProjects(fetchedProjects);
          setReels(fetchedReels);
          setTestimonials(fetchedTestimonials);
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
