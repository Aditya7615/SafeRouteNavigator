import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "fas fa-chart-line",
    title: "Crime Data Analysis",
    description: "Utilizes historical and real-time crime data to identify high-risk areas and automatically routes you around them."
  },
  {
    icon: "fas fa-lightbulb",
    title: "Lighting Conditions",
    description: "Analyzes street lighting data to avoid poorly lit areas, especially during evening and night hours."
  },
  {
    icon: "fas fa-users",
    title: "Crowd Density",
    description: "Monitors population density in real-time to suggest routes through appropriately populated areas."
  },
  {
    icon: "fas fa-bell",
    title: "Real-Time Alerts",
    description: "Provides immediate notifications about incidents, protests, or accidents along your route."
  },
  {
    icon: "fas fa-comments",
    title: "Community Reports",
    description: "Leverages crowd-sourced safety reports to update routes with the most current safety information."
  },
  {
    icon: "fas fa-shield-alt",
    title: "Safety Score",
    description: "Each route receives a calculated safety score to help you make informed decisions about your journey."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">AI-Powered Safety Features</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Our advanced algorithms analyze multiple data sources to provide you with the safest possible route.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
