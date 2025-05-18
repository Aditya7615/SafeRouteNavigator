import { Link } from "wouter";
import { Shield } from "lucide-react";

const Footer = () => {
  const supportedCities = [
    "Delhi NCR",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad"
  ];

  const resources = [
    { name: "Safety Tips", link: "#" },
    { name: "Community Guidelines", link: "#" },
    { name: "API Documentation", link: "#" },
    { name: "Data Sources", link: "#" },
    { name: "Partner Program", link: "#" }
  ];

  const companyLinks = [
    { name: "About Us", link: "#" },
    { name: "Careers", link: "#" },
    { name: "Press", link: "#" },
    { name: "Contact", link: "#" },
    { name: "Privacy Policy", link: "#" }
  ];

  return (
    <footer className="bg-dark-300 border-t border-gray-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/">
              <a className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-white">SafeRoute</span>
              </a>
            </Link>
            <p className="text-gray-400 mb-4">AI-powered navigation that prioritizes your safety across Indian cities.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Supported Cities</h3>
            <ul className="space-y-2 text-gray-400">
              {supportedCities.map((city, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors">{city}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.link} className="hover:text-primary transition-colors">{resource.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.link} className="hover:text-primary transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} SafeRoute. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
