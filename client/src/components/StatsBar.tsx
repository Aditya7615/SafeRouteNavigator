import { useEffect, useState } from "react";

interface Stat {
  value: string;
  label: string;
  countTo?: number;
}

const StatsBar = () => {
  const [stats, setStats] = useState<Stat[]>([
    { value: "0", label: "Daily Routes Planned", countTo: 500 },
    { value: "0", label: "Indian Cities Covered", countTo: 12 },
    { value: "0%", label: "Safety Accuracy", countTo: 95 },
    { value: "0", label: "Community Reports", countTo: 10000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => {
        return prevStats.map((stat) => {
          if (!stat.countTo) return stat;
          
          const current = parseInt(stat.value.replace(/[^0-9]/g, '') || '0');
          if (current >= stat.countTo) {
            clearInterval(interval);
            return stat;
          }
          
          const increment = Math.ceil(stat.countTo / 20);
          const newValue = Math.min(current + increment, stat.countTo);
          
          // Format the value
          let formattedValue = '';
          if (stat.label.includes('Accuracy')) {
            formattedValue = `${newValue}%`;
          } else if (stat.countTo >= 1000) {
            formattedValue = `${Math.floor(newValue / 1000)}K+`;
          } else {
            formattedValue = `${newValue}+`;
          }
          
          return { ...stat, value: formattedValue };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass border-t border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <p className="text-primary text-3xl font-bold font-heading">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
