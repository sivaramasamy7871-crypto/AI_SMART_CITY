// Real-World Live Weather & Time Fetcher via Open-Meteo API (Free & No API Key Required)

export async function fetchLiveCityWeather(lat, lng, timezone = 'auto') {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=${encodeURIComponent(timezone)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    
    const cur = data.current_weather;
    if (!cur) return null;

    // Map WMO Weather Code to simulator weather types
    // 0 = Clear, 1-3 = Cloud/Fog, 51-67 = Rain, 95-99 = Storm
    let simWeather = 'clear';
    const code = cur.weathercode;
    if (code >= 95) {
      simWeather = 'storm';
    } else if (code >= 51 && code <= 67) {
      simWeather = 'rain';
    } else if (code >= 45 && code <= 48) {
      simWeather = 'fog';
    } else {
      simWeather = 'clear';
    }

    // Extract local time from API response (e.g. "2026-09-06T15:45")
    let localHours = 14.5;
    if (cur.time) {
      const timePart = cur.time.split('T')[1];
      if (timePart) {
        const [h, m] = timePart.split(':').map(Number);
        localHours = h + m / 60;
      }
    }

    return {
      temperature: `${Math.round(cur.temperature)}°C`,
      windspeed: `${cur.windspeed} km/h`,
      weatherCode: code,
      simWeather,
      localHours,
      rawTime: cur.time
    };
  } catch (err) {
    console.warn("Live weather fetch skipped or offline, using default weather.", err);
    return null;
  }
}
