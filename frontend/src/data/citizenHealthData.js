const citizenHealthData = {
  currentAQI: 156,
  riskLevel: "Poor",

  groups: [
    {
      id: 1,
      title: "👶 Children",
      advice: [
        "Stay indoors",
        "Avoid outdoor games",
        "Wear N95 mask if outside",
      ],
    },
    {
      id: 2,
      title: "👴 Elderly",
      advice: [
        "Avoid morning walks",
        "Use an air purifier if available",
        "Keep windows closed during peak pollution",
      ],
    },
    {
      id: 3,
      title: "🤧 Asthma Patients",
      advice: [
        "Carry your inhaler",
        "Avoid dusty areas",
        "Consult your doctor if symptoms worsen",
      ],
    },
    {
      id: 4,
      title: "💪 Healthy Adults",
      advice: [
        "Reduce outdoor exercise",
        "Wear a mask while commuting",
        "Drink plenty of water",
      ],
    },
  ],
};

export default citizenHealthData;