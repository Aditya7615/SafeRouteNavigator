import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = (platform: string) => {
    setIsDownloading(true);
    
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Download Information",
        description: `The ${platform} app is coming soon! We'll notify you when it's available.`,
      });
    }, 1000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-purple relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1605812860427-4024433a70fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="People using navigation app in city" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold font-heading text-white mb-6">Start Navigating Safely Today</h2>
        <p className="text-xl text-white/80 mb-10">Join thousands of users across India who are making smarter, safer routing decisions with SafeRoute.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            disabled={isDownloading}
            onClick={() => handleDownload("Android")}
            className="bg-white text-primary hover:bg-gray-100 transition-colors rounded-lg px-8 py-4 font-bold font-heading shadow-lg flex items-center justify-center disabled:opacity-80"
          >
            {isDownloading ? (
              <i className="fas fa-spinner fa-spin mr-2 text-xl"></i>
            ) : (
              <i className="fab fa-google-play mr-2 text-xl"></i>
            )}
            Download for Android
          </button>
          <button
            disabled={isDownloading}
            onClick={() => handleDownload("iOS")}
            className="bg-white text-primary hover:bg-gray-100 transition-colors rounded-lg px-8 py-4 font-bold font-heading shadow-lg flex items-center justify-center disabled:opacity-80"
          >
            {isDownloading ? (
              <i className="fas fa-spinner fa-spin mr-2 text-xl"></i>
            ) : (
              <i className="fab fa-apple mr-2 text-xl"></i>
            )}
            Download for iOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
