// Clean OpenStreetMap & Esri World Imagery Tiles without any watermark

export async function getUserLiveLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const geoInfo = await reverseGeocode(lat, lng);
          resolve({
            lat,
            lng,
            cityName: geoInfo.cityName,
            country: geoInfo.country,
            displayName: geoInfo.displayName
          });
        } catch (e) {
          resolve({
            lat,
            lng,
            cityName: `GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
            country: "Live Location 📍",
            displayName: `Live Location`
          });
        }
      },
      (error) => reject(error),
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
    if (!res.ok) throw new Error("Reverse geocoding failed");
    const data = await res.json();
    const addr = data.address || {};
    const cityName = addr.city || addr.town || addr.municipality || addr.county || addr.suburb || "My Live Location";
    const country = addr.country || "Live GPS";
    return {
      cityName,
      country,
      displayName: `${cityName}, ${country}`
    };
  } catch (e) {
    return {
      cityName: `GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      country: "Live GPS",
      displayName: `GPS Location`
    };
  }
}

export function latLngToTile(lat, lng, zoom = 15) {
  const n = 2 ** zoom;
  const rad = (lat * Math.PI) / 180;
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * n);
  return { x, y, zoom };
}

// OpenStreetMap Clean Tile Server (Zero Watermarks)
export function getTileUrl(x, y, zoom = 15) {
  const sub = ['a', 'b', 'c'][Math.abs(x + y) % 3];
  return `https://${sub}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}
