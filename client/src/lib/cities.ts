export const indianCities = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi"
];

export interface CityData {
  lat: number;
  lng: number;
  popularPlaces: string[];
}

export const cityCoordinates: Record<string, CityData> = {
  "Delhi NCR": {
    lat: 28.6139,
    lng: 77.2090,
    popularPlaces: [
      "Connaught Place, Delhi",
      "India Gate, Delhi",
      "Qutub Minar, Delhi",
      "Red Fort, Delhi",
      "Cyber City, Gurugram",
      "Sector 18, Noida",
      "Karol Bagh, Delhi",
      "South Extension, Delhi",
      "Lajpat Nagar, Delhi",
      "Saket, Delhi",
      "Dwarka, Delhi",
      "Rajouri Garden, Delhi",
      "Janakpuri, Delhi",
      "Mayur Vihar, Delhi",
      "Vasant Kunj, Delhi",
      "Greater Kailash, Delhi",
      "Hauz Khas, Delhi",
      "Malviya Nagar, Delhi",
      "Defence Colony, Delhi",
      "Laxmi Nagar, Delhi",
      "Chandni Chowk, Delhi",
      "Nizamuddin, Delhi",
      "Khan Market, Delhi",
      "Lodhi Gardens, Delhi",
      "Safdarjung, Delhi"
    ]
  },
  "Mumbai": {
    lat: 19.0760,
    lng: 72.8777,
    popularPlaces: [
      "Bandra, Mumbai",
      "Juhu Beach, Mumbai",
      "Marine Drive, Mumbai",
      "Colaba, Mumbai",
      "Andheri, Mumbai",
      "Worli, Mumbai"
    ]
  },
  "Bangalore": {
    lat: 12.9716,
    lng: 77.5946,
    popularPlaces: [
      "MG Road, Bangalore",
      "Indiranagar, Bangalore",
      "Koramangala, Bangalore",
      "Electronic City, Bangalore",
      "Whitefield, Bangalore",
      "HSR Layout, Bangalore"
    ]
  },
  "Chennai": {
    lat: 13.0827,
    lng: 80.2707,
    popularPlaces: [
      "Marina Beach, Chennai",
      "T Nagar, Chennai",
      "Anna Nagar, Chennai",
      "Adyar, Chennai",
      "Mylapore, Chennai",
      "Velachery, Chennai"
    ]
  },
  "Kolkata": {
    lat: 22.5726,
    lng: 88.3639,
    popularPlaces: [
      "Park Street, Kolkata",
      "Salt Lake, Kolkata",
      "New Town, Kolkata",
      "Howrah, Kolkata",
      "Esplanade, Kolkata",
      "Ballygunge, Kolkata"
    ]
  },
  "Hyderabad": {
    lat: 17.3850,
    lng: 78.4867,
    popularPlaces: [
      "Hitech City, Hyderabad",
      "Banjara Hills, Hyderabad",
      "Gachibowli, Hyderabad",
      "Jubilee Hills, Hyderabad",
      "Secunderabad, Hyderabad",
      "Madhapur, Hyderabad"
    ]
  }
};
