import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AlertCardProps {
  type: string;
  time: string;
  description: string;
  reporter: string;
  confirms: number;
}

const AlertCard = ({ type, time, description, reporter, confirms }: AlertCardProps) => {
  const { toast } = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(confirms);

  const getAlertIcon = () => {
    switch (type) {
      case "Road Blockade":
        return "fas fa-exclamation-circle text-destructive";
      case "Street Lights Out":
        return "fas fa-lightbulb text-yellow-500";
      case "Police Presence":
        return "fas fa-shield-alt text-blue-500";
      case "Accident":
        return "fas fa-car-crash text-orange-500";
      default:
        return "fas fa-info-circle text-primary";
    }
  };

  const getBackgroundClass = () => {
    switch (type) {
      case "Road Blockade":
        return "bg-destructive/20";
      case "Street Lights Out":
        return "bg-yellow-500/20";
      case "Police Presence":
        return "bg-blue-500/20";
      case "Accident":
        return "bg-orange-500/20";
      default:
        return "bg-primary/20";
    }
  };

  const handleConfirm = async () => {
    if (confirmed) return;
    
    try {
      // In a real implementation, this would call the backend
      // await apiRequest('POST', '/api/alerts/confirm', { type });
      
      setConfirmed(true);
      setConfirmCount(prev => prev + 1);
      
      toast({
        title: "Report confirmed",
        description: "Thank you for helping keep the community safe.",
      });
    } catch (error) {
      toast({
        title: "Error confirming report",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`rounded-full ${getBackgroundClass()} p-2 mr-2`}>
            <i className={getAlertIcon()}></i>
          </div>
          <span className="font-medium text-white">{type}</span>
        </div>
        <span className="text-gray-400 text-sm">{time}</span>
      </div>
      <div className="p-4">
        <p className="text-gray-300 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Reported by: <span className="text-primary">{reporter}</span></span>
          <div className="flex items-center">
            <span className="text-gray-400 text-sm mr-2">{confirmCount} confirms</span>
            <button 
              className={`${confirmed ? 'text-accent' : 'text-primary hover:text-white'} text-sm`}
              onClick={handleConfirm}
              disabled={confirmed}
            >
              <i className={`fas fa-thumbs-up ${confirmed ? 'text-accent' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
