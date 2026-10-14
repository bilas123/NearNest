// Gets current GPS coordinates and optionally syncs with backend
export function getCurrentCoordinates(token) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("No geolocation"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (token) {
          fetch("/api/users/location", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ latitude, longitude }),
          }).catch(() => {});
        }
        resolve({ latitude, longitude });
      },
      reject,
      { timeout: 8000, maximumAge: 60000 }
    );
  });
}

// Reverse geocode coordinates to a place name using OpenStreetMap
export async function getAddressFromCoords(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: { "Accept-Language": "en" },
    });
    const data = await res.json();
    const a = data.address || {};
    const area = a.suburb || a.neighbourhood || a.road || a.residential || "";
    const city = a.city || a.town || a.county || a.state || "";
    return area && city ? `${area}, ${city}` : area || city || "Selected Location";
  } catch {
    return "Selected Location";
  }
}

// Calculate distance in km between two GPS coordinates using Haversine formula
export function getDistanceInKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Format distance for UI badges
export function formatDistance(km) {
  if (km == null || isNaN(km)) return null;
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
}
