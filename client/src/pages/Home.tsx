import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Features from "@/components/Features";
import SafetyMap from "@/components/SafetyMap";
import RouteComparison from "@/components/RouteComparison";
import CommunityReports from "@/components/CommunityReports";
import CTASection from "@/components/CTASection";
import { useEffect } from "react";

const Home = () => {
  // Update page title and meta description
  useEffect(() => {
    document.title = "SafeRoute - AI-Powered Safe Navigation in Indian Cities";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Navigate safely through Indian cities with AI-powered real-time routing that prioritizes your safety based on crime data, lighting conditions, and crowd density.");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <StatsBar />
      <Features />
      <SafetyMap />
      <RouteComparison />
      <CommunityReports />
      <CTASection />
      
      {/* Mobile action button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="gradient-purple rounded-full p-4 shadow-lg pulse">
          <i className="fas fa-route text-white text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Home;
