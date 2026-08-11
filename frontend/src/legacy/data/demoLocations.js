export const demoLocations = [
  { name: 'Vijayawada', region: 'Andhra Pradesh', country: 'India', lat: 16.5062, lng: 80.6480 },
  { name: 'Hyderabad', region: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867 },
  { name: 'Visakhapatnam', region: 'Andhra Pradesh', country: 'India', lat: 17.6868, lng: 83.2185 },
];

export const findLocation = (query) => {
  if (!query) return demoLocations[0];
  const lowerQuery = query.toLowerCase();
  const match = demoLocations.find(
    (loc) => loc.name.toLowerCase().includes(lowerQuery) || loc.region.toLowerCase().includes(lowerQuery)
  );
  return match || demoLocations[0];
};

export const getDefaultLocation = () => demoLocations[0];

export const findNearestLocation = (lat, lng) => {
  let nearest = demoLocations[0];
  let minDistance = Infinity;

  for (const loc of demoLocations) {
    const dLat = loc.lat - lat;
    const dLng = loc.lng - lng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng); // Simple Euclidean for demo
    if (distance < minDistance) {
      minDistance = distance;
      nearest = loc;
    }
  }
  return nearest;
};
