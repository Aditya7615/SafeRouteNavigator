// Mock data for the SafeRoute application

// Mock route comparison data
export const mockRouteComparisonData = [
  {
    type: "Safest Route",
    safetyScore: 94,
    distance: "4.7 km",
    time: "18 min",
    lighting: "Good",
    safetyFactors: ["Well Lit", "High Foot Traffic", "Police Presence", "Low Crime Area"],
    isRecommended: true,
    imageSrc: "https://pixabay.com/get/gaebe99d0dde4d35dffad43daca33b237bba7ad2c6fcb3dba8b72964482bed1e925975f3d42c6418b911fed17a0dfa1dc_1280.jpg"
  },
  {
    type: "Shortest Route",
    safetyScore: 62,
    distance: "3.2 km",
    time: "12 min",
    lighting: "Poor",
    safetyIssues: ["Poor Lighting", "Isolated Areas", "Recent Crime Reports"],
    isRecommended: false,
    imageSrc: "https://pixabay.com/get/gc0c6b29b082289d91fe1a66f2973dca9fc024034a8a691e14f8df8f081a797ff5d65eeeee5c846fb69f38c91b5899086_1280.jpg"
  }
];

// Mock alerts data
export const mockAlertsData = [
  {
    type: "Road Blockade",
    description: "Protest blocking traffic near Janpath Road in Central Delhi. Multiple roads closed. Avoid the area if possible.",
    latitude: 28.6139,
    longitude: 77.2090,
    reporterName: "Amit S.",
    confirms: 12
  },
  {
    type: "Street Lights Out",
    description: "Street lights not working on MG Road near Brigade Road junction in Bangalore. Area is dark, exercise caution.",
    latitude: 12.9716,
    longitude: 77.5946,
    reporterName: "Priya K.",
    confirms: 8
  },
  {
    type: "Police Presence",
    description: "Increased police patrol near Mumbai Central station. Area is secure with additional officers on duty.",
    latitude: 19.0760,
    longitude: 72.8777,
    reporterName: "Rahul M.",
    confirms: 15
  },
  {
    type: "Accident",
    description: "Minor accident near Electronic City signal light. Traffic moving slowly. Plan alternative route if possible.",
    latitude: 12.8425,
    longitude: 77.6563,
    reporterName: "Vikram P.",
    confirms: 6
  },
  {
    type: "Street Lights Out",
    description: "All street lights out on Sardar Patel road near IIT-Madras. Very dark conditions, use caution if walking.",
    latitude: 13.0074,
    longitude: 80.2376,
    reporterName: "Deepa L.",
    confirms: 10
  },
  {
    type: "Road Blockade",
    description: "Construction activity blocking half of Parliament Street. Heavy traffic delay expected for next 3 days.",
    latitude: 28.6198,
    longitude: 77.2123,
    reporterName: "Rajiv G.",
    confirms: 18
  }
];

// Mock safety data
export const mockSafetyData = {
  "Delhi NCR": {
    crimeHotspots: [
      { lat: 28.6531, lng: 77.2135, severity: 8, description: "High theft area" },
      { lat: 28.6384, lng: 77.1908, severity: 7, description: "Street crime reports" },
      { lat: 28.6129, lng: 77.2295, severity: 9, description: "Multiple incidents at night" }
    ],
    poorLighting: [
      { lat: 28.6298, lng: 77.2021, severity: 6, description: "Street lights out" },
      { lat: 28.6462, lng: 77.1937, severity: 8, description: "Dark alley, avoid at night" },
      { lat: 28.6187, lng: 77.2360, severity: 7, description: "Dimly lit area" }
    ],
    crowdDensity: [
      { lat: 28.6291, lng: 77.2183, level: "high", time: "evening" },
      { lat: 28.6325, lng: 77.2154, level: "medium", time: "all-day" },
      { lat: 28.6405, lng: 77.2149, level: "low", time: "night" }
    ],
    emergencyServices: [
      { lat: 28.6343, lng: 77.2151, type: "Police Station", name: "Connaught Place Police Station" },
      { lat: 28.6248, lng: 77.2043, type: "Hospital", name: "Ram Manohar Lohia Hospital" },
      { lat: 28.6367, lng: 77.2217, type: "Fire Station", name: "Delhi Fire Service HQ" }
    ]
  },
  "Mumbai": {
    crimeHotspots: [
      { lat: 19.0822, lng: 72.8400, severity: 7, description: "Pickpocket reports" },
      { lat: 19.0642, lng: 72.8352, severity: 6, description: "Isolated incidents" },
      { lat: 19.0918, lng: 72.8553, severity: 8, description: "Late night concerns" }
    ],
    poorLighting: [
      { lat: 19.0725, lng: 72.8537, severity: 7, description: "Dim street lighting" },
      { lat: 19.0543, lng: 72.8455, severity: 8, description: "Dark stretch near station" },
      { lat: 19.0826, lng: 72.8354, severity: 6, description: "Poorly lit side roads" }
    ],
    crowdDensity: [
      { lat: 19.0736, lng: 72.8553, level: "very-high", time: "rush-hour" },
      { lat: 19.0635, lng: 72.8631, level: "high", time: "evening" },
      { lat: 19.0819, lng: 72.8719, level: "medium", time: "all-day" }
    ],
    emergencyServices: [
      { lat: 19.0743, lng: 72.8554, type: "Police Station", name: "Bandra Police Station" },
      { lat: 19.0639, lng: 72.8359, type: "Hospital", name: "Lilavati Hospital" },
      { lat: 19.0813, lng: 72.8433, type: "Fire Station", name: "Bandra Fire Station" }
    ]
  },
  "Bangalore": {
    crimeHotspots: [
      { lat: 12.9789, lng: 77.6406, severity: 6, description: "Theft reports" },
      { lat: 12.9833, lng: 77.6123, severity: 7, description: "Evening safety concerns" },
      { lat: 12.9615, lng: 77.5969, severity: 8, description: "Mugging incidents" }
    ],
    poorLighting: [
      { lat: 12.9722, lng: 77.6404, severity: 7, description: "Poor visibility area" },
      { lat: 12.9626, lng: 77.6198, severity: 6, description: "Limited street lights" },
      { lat: 12.9787, lng: 77.6088, severity: 8, description: "Dark public spaces" }
    ],
    crowdDensity: [
      { lat: 12.9705, lng: 77.6038, level: "high", time: "evening" },
      { lat: 12.9814, lng: 77.6132, level: "medium", time: "all-day" },
      { lat: 12.9765, lng: 77.5993, level: "low", time: "late-night" }
    ],
    emergencyServices: [
      { lat: 12.9719, lng: 77.5970, type: "Police Station", name: "Cubbon Park Police Station" },
      { lat: 12.9777, lng: 77.6132, type: "Hospital", name: "Manipal Hospital" },
      { lat: 12.9684, lng: 77.6099, type: "Fire Station", name: "Bangalore Fire Station" }
    ]
  }
};

// Mock map data
export const mockMapData = {
  "Delhi NCR": {
    cityCenter: { lat: 28.6139, lng: 77.2090 },
    crimeHotspots: [
      { lat: 28.6531, lng: 77.2135, type: "Theft", description: "Several thefts reported in the last week" },
      { lat: 28.6384, lng: 77.1908, type: "Harassment", description: "Multiple harassment incidents" },
      { lat: 28.6129, lng: 77.2295, type: "Robbery", description: "Armed robbery reported at night" },
      { lat: 28.6298, lng: 77.2121, type: "Assault", description: "Group assault reported" }
    ],
    poorLighting: [
      { lat: 28.6298, lng: 77.2021, description: "Street lights not functioning" },
      { lat: 28.6462, lng: 77.1937, description: "Dark alleyway, avoid at night" },
      { lat: 28.6187, lng: 77.2360, description: "Poorly lit market area" }
    ],
    communityReports: [
      { lat: 28.6198, lng: 77.2123, type: "Road Blockade", description: "Construction blocking road" },
      { lat: 28.6343, lng: 77.2251, type: "Suspicious Activity", description: "Group of suspicious individuals loitering" },
      { lat: 28.6125, lng: 77.2135, type: "Accident", description: "Minor accident causing traffic" }
    ],
    safeRoutes: [
      {
        coordinates: [
          [77.2090, 28.6139],
          [77.2099, 28.6150],
          [77.2130, 28.6152],
          [77.2160, 28.6148],
          [77.2185, 28.6155]
        ],
        color: "#10B981",
        width: 4
      },
      {
        coordinates: [
          [77.2090, 28.6139],
          [77.2080, 28.6160],
          [77.2085, 28.6180],
          [77.2120, 28.6195],
          [77.2185, 28.6155]
        ],
        color: "#EF4444",
        width: 3
      }
    ]
  },
  "Mumbai": {
    cityCenter: { lat: 19.0760, lng: 72.8777 },
    crimeHotspots: [
      { lat: 19.0822, lng: 72.8400, type: "Pickpocket", description: "Frequent pickpocketing" },
      { lat: 19.0642, lng: 72.8352, type: "Theft", description: "Mobile phone theft reports" },
      { lat: 19.0918, lng: 72.8553, type: "Harassment", description: "Eve teasing reported" }
    ],
    poorLighting: [
      { lat: 19.0725, lng: 72.8537, description: "Dim lighting on main road" },
      { lat: 19.0543, lng: 72.8455, description: "Dark stretch near station entrance" },
      { lat: 19.0826, lng: 72.8354, description: "Poorly lit residential area" }
    ],
    communityReports: [
      { lat: 19.0743, lng: 72.8554, type: "Police Presence", description: "Increased police patrol" },
      { lat: 19.0805, lng: 72.8465, type: "Street Lights Out", description: "No functioning lights for 500m" },
      { lat: 19.0625, lng: 72.8375, type: "Group Fight", description: "Large fight reported" }
    ],
    safeRoutes: [
      {
        coordinates: [
          [72.8700, 19.0700],
          [72.8680, 19.0720],
          [72.8630, 19.0735],
          [72.8600, 19.0760],
          [72.8580, 19.0800]
        ],
        color: "#10B981",
        width: 4
      },
      {
        coordinates: [
          [72.8700, 19.0700],
          [72.8650, 19.0690],
          [72.8620, 19.0710],
          [72.8590, 19.0750],
          [72.8580, 19.0800]
        ],
        color: "#EF4444",
        width: 3
      }
    ]
  },
  "Bangalore": {
    cityCenter: { lat: 12.9716, lng: 77.5946 },
    crimeHotspots: [
      { lat: 12.9789, lng: 77.6406, type: "Theft", description: "Laptop theft in coffee shops" },
      { lat: 12.9833, lng: 77.6123, type: "Scam", description: "Auto rickshaw scam targeting tourists" },
      { lat: 12.9615, lng: 77.5969, type: "Robbery", description: "Chain snatching incidents" }
    ],
    poorLighting: [
      { lat: 12.9722, lng: 77.6404, description: "Poor visibility on side streets" },
      { lat: 12.9626, lng: 77.6198, description: "Limited lighting near park area" },
      { lat: 12.9787, lng: 77.6088, description: "Dark undeveloped plots" }
    ],
    communityReports: [
      { lat: 12.9725, lng: 77.5970, type: "Street Lights Out", description: "Entire block without lights" },
      { lat: 12.9825, lng: 77.6085, type: "Traffic Jam", description: "Severe congestion due to accident" },
      { lat: 12.9655, lng: 77.6120, type: "Suspicious Activity", description: "Unusual group gathering" }
    ],
    safeRoutes: [
      {
        coordinates: [
          [77.5900, 12.9700],
          [77.5920, 12.9730],
          [77.5950, 12.9760],
          [77.5970, 12.9775],
          [77.6000, 12.9800]
        ],
        color: "#10B981",
        width: 4
      },
      {
        coordinates: [
          [77.5900, 12.9700],
          [77.5935, 12.9715],
          [77.5960, 12.9730],
          [77.5980, 12.9750],
          [77.6000, 12.9800]
        ],
        color: "#EF4444",
        width: 3
      }
    ]
  }
};
