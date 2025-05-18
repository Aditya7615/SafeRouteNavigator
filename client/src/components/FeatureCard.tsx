import { useState } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`feature-card glass rounded-xl p-6 border ${isHovered ? 'border-primary shadow-lg shadow-primary/10' : 'border-gray-700'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`rounded-full ${isHovered ? 'bg-primary/30' : 'bg-primary/20'} p-3 w-14 h-14 flex items-center justify-center mb-4 transition-all duration-300`}>
        <i className={`${icon} text-primary text-xl`}></i>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
