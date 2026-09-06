// Real-World City Map Presets with Real GPS Coordinates, Unique Layouts, and Landmarks

export const REAL_CITIES = [
  {
    id: 'chennai',
    name: 'Chennai (Marina Coast)',
    country: 'India 🇮🇳',
    lat: 13.0827,
    lng: 80.2707,
    timezone: 'Asia/Kolkata',
    description: 'Bay of Bengal coastline, Kamarajar Salai beach expressway, Marina Lighthouse, and Central High-rises.',
    waterSide: 'east', // East coast sea
    landmarkType: 'lighthouse',
    ambientTemp: '32°C',
    buildings: [
      { id: 'b_ch_1', type: 'commercial', name: 'Tidel Cyber Park', grid_x: -2, grid_z: -2, world_x: -3.4, world_z: -3.4, width: 1.2, depth: 1.2, height: 3.8, floors: 16, occupants: 240, power_draw: 4.2, revenue_per_tick: 950 },
      { id: 'b_ch_2', type: 'residential', name: 'Marina Cove Towers', grid_x: -1, grid_z: -1, world_x: -1.7, world_z: -1.7, width: 1.0, depth: 1.0, height: 3.2, floors: 12, occupants: 180, power_draw: 2.5, revenue_per_tick: 480 },
      { id: 'b_ch_3', type: 'hospital', name: 'Apollo Health Supercenter', grid_x: -2, grid_z: 1, world_x: -3.4, world_z: 1.7, width: 1.1, depth: 1.1, height: 2.6, floors: 10, occupants: 150, power_draw: 3.2, revenue_per_tick: -100 },
      { id: 'b_ch_4', type: 'commercial', name: 'Express Avenue Hub', grid_x: 0, grid_z: -2, world_x: 0, world_z: -3.4, width: 1.3, depth: 1.1, height: 4.5, floors: 20, occupants: 310, power_draw: 5.0, revenue_per_tick: 1300 },
      { id: 'b_ch_5', type: 'park', name: 'Semmozhi Poonga Botanical', grid_x: 1, grid_z: -1, world_x: 1.7, world_z: -1.7, width: 1.2, depth: 1.2, height: 0.3, floors: 1, occupants: 0, power_draw: 0.1, revenue_per_tick: -20 },
      { id: 'b_ch_6', type: 'police', name: 'Commissioner Enforcement HQ', grid_x: -1, grid_z: 2, world_x: -1.7, world_z: 3.4, width: 1.0, depth: 1.0, height: 2.0, floors: 6, occupants: 60, power_draw: 1.8, revenue_per_tick: -80 },
      { id: 'b_ch_7', type: 'solar_plant', name: 'Ennore Solar Array', grid_x: -3, grid_z: 0, world_x: -5.1, world_z: 0, width: 1.4, depth: 1.4, height: 0.8, floors: 2, occupants: 10, power_draw: -35.0, revenue_per_tick: 600 },
      { id: 'b_ch_8', type: 'residential', name: 'Anna Nagar Haven', grid_x: -2, grid_z: -1, world_x: -3.4, world_z: -1.7, width: 1.0, depth: 1.0, height: 2.8, floors: 10, occupants: 140, power_draw: 2.0, revenue_per_tick: 390 }
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo (Shinjuku Core)',
    country: 'Japan 🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    timezone: 'Asia/Tokyo',
    description: 'Dense skyscraper canyons, Tokyo Tower spire, Yamanote rail circuit, and high-tech commercial plazas.',
    waterSide: 'none',
    landmarkType: 'tokyo_tower',
    ambientTemp: '19°C',
    buildings: [
      { id: 'b_tk_1', type: 'commercial', name: 'Shinjuku Center Tower', grid_x: -1, grid_z: -1, world_x: -1.7, world_z: -1.7, width: 1.1, depth: 1.1, height: 5.2, floors: 26, occupants: 420, power_draw: 6.2, revenue_per_tick: 1600 },
      { id: 'b_tk_2', type: 'commercial', name: 'Mode Gakuen Cocoon', grid_x: 1, grid_z: -1, world_x: 1.7, world_z: -1.7, width: 1.0, depth: 1.0, height: 4.8, floors: 24, occupants: 360, power_draw: 5.5, revenue_per_tick: 1400 },
      { id: 'b_tk_3', type: 'residential', name: 'Roppongi Hills Residences', grid_x: -2, grid_z: 1, world_x: -3.4, world_z: 1.7, width: 1.1, depth: 1.1, height: 4.2, floors: 20, occupants: 290, power_draw: 3.8, revenue_per_tick: 850 },
      { id: 'b_tk_4', type: 'commercial', name: 'Akihabara Cyber Hub', grid_x: 0, grid_z: 2, world_x: 0, world_z: 3.4, width: 1.2, depth: 1.2, height: 3.9, floors: 18, occupants: 270, power_draw: 4.9, revenue_per_tick: 1100 },
      { id: 'b_tk_5', type: 'park', name: 'Shinjuku Gyoen National Garden', grid_x: 2, grid_z: 1, world_x: 3.4, world_z: 1.7, width: 1.3, depth: 1.3, height: 0.4, floors: 1, occupants: 0, power_draw: 0.1, revenue_per_tick: -25 },
      { id: 'b_tk_6', type: 'hospital', name: 'Tokyo University Medical', grid_x: -1, grid_z: 2, world_x: -1.7, world_z: 3.4, width: 1.1, depth: 1.1, height: 3.0, floors: 12, occupants: 190, power_draw: 3.5, revenue_per_tick: -120 },
      { id: 'b_tk_7', type: 'solar_plant', name: 'Neo-Kanto Solar Grid', grid_x: -3, grid_z: -2, world_x: -5.1, world_z: -3.4, width: 1.3, depth: 1.3, height: 0.8, floors: 2, occupants: 12, power_draw: -40.0, revenue_per_tick: 700 }
    ]
  },
  {
    id: 'newyork',
    name: 'New York (Manhattan)',
    country: 'United States 🇺🇸',
    lat: 40.7128,
    lng: -74.0060,
    timezone: 'America/New_York',
    description: 'Iconic Manhattan avenue grid, Empire & One WTC supertalls, Central Park enclave, and Hudson river.',
    waterSide: 'west',
    landmarkType: 'empire_spire',
    ambientTemp: '22°C',
    buildings: [
      { id: 'b_ny_1', type: 'commercial', name: 'One World Freedom Tower', grid_x: -1, grid_z: -2, world_x: -1.7, world_z: -3.4, width: 1.2, depth: 1.2, height: 5.6, floors: 28, occupants: 480, power_draw: 6.8, revenue_per_tick: 1800 },
      { id: 'b_ny_2', type: 'commercial', name: 'Empire Central Complex', grid_x: 0, grid_z: -1, world_x: 0, world_z: -1.7, width: 1.2, depth: 1.2, height: 5.0, floors: 25, occupants: 400, power_draw: 6.0, revenue_per_tick: 1550 },
      { id: 'b_ny_3', type: 'residential', name: 'Hudson Yards Residences', grid_x: -2, grid_z: 0, world_x: -3.4, world_z: 0, width: 1.0, depth: 1.0, height: 4.4, floors: 21, occupants: 310, power_draw: 3.9, revenue_per_tick: 900 },
      { id: 'b_ny_4', type: 'park', name: 'Central Park Green Quad', grid_x: 1, grid_z: 0, world_x: 1.7, world_z: 0, width: 1.4, depth: 1.4, height: 0.3, floors: 1, occupants: 0, power_draw: 0.1, revenue_per_tick: -30 },
      { id: 'b_ny_5', type: 'commercial', name: 'Wall Street Exchange', grid_x: -1, grid_z: 1, world_x: -1.7, world_z: 1.7, width: 1.3, depth: 1.1, height: 4.1, floors: 19, occupants: 330, power_draw: 5.2, revenue_per_tick: 1450 },
      { id: 'b_ny_6', type: 'hospital', name: 'Mount Sinai Medical', grid_x: 2, grid_z: -2, world_x: 3.4, world_z: -3.4, width: 1.1, depth: 1.1, height: 2.8, floors: 11, occupants: 170, power_draw: 3.1, revenue_per_tick: -110 },
      { id: 'b_ny_7', type: 'police', name: 'NYPD Central Precinct 01', grid_x: 0, grid_z: 2, world_x: 0, world_z: 3.4, width: 1.0, depth: 1.0, height: 2.2, floors: 7, occupants: 75, power_draw: 2.0, revenue_per_tick: -90 }
    ]
  },
  {
    id: 'london',
    name: 'London (Thames Embankment)',
    country: 'United Kingdom 🇬🇧',
    lat: 51.5074,
    lng: -0.1278,
    timezone: 'Europe/London',
    description: 'River Thames waterfront, The Shard skyscraper, London Eye, and historic Westminster district.',
    waterSide: 'south',
    landmarkType: 'shard',
    ambientTemp: '16°C',
    buildings: [
      { id: 'b_ld_1', type: 'commercial', name: 'The Shard Tower', grid_x: 0, grid_z: -1, world_x: 0, world_z: -1.7, width: 1.1, depth: 1.1, height: 5.1, floors: 26, occupants: 410, power_draw: 5.9, revenue_per_tick: 1600 },
      { id: 'b_ld_2', type: 'commercial', name: '30 St Mary Axe (Gherkin)', grid_x: -2, grid_z: -2, world_x: -3.4, world_z: -3.4, width: 1.1, depth: 1.1, height: 4.3, floors: 20, occupants: 320, power_draw: 4.8, revenue_per_tick: 1250 },
      { id: 'b_ld_3', type: 'residential', name: 'Canary Wharf Apartments', grid_x: 1, grid_z: -2, world_x: 1.7, world_z: -3.4, width: 1.0, depth: 1.0, height: 3.8, floors: 17, occupants: 240, power_draw: 3.0, revenue_per_tick: 720 },
      { id: 'b_ld_4', type: 'park', name: 'Hyde Park Botanical', grid_x: -2, grid_z: 1, world_x: -3.4, world_z: 1.7, width: 1.3, depth: 1.3, height: 0.3, floors: 1, occupants: 0, power_draw: 0.1, revenue_per_tick: -20 },
      { id: 'b_ld_5', type: 'hospital', name: 'St Thomas Hospital', grid_x: 1, grid_z: 1, world_x: 1.7, world_z: 1.7, width: 1.1, depth: 1.1, height: 2.7, floors: 10, occupants: 160, power_draw: 3.0, revenue_per_tick: -100 },
      { id: 'b_ld_6', type: 'solar_plant', name: 'Thames Solar Grid', grid_x: 2, grid_z: -1, world_x: 3.4, world_z: -1.7, width: 1.2, depth: 1.2, height: 0.8, floors: 2, occupants: 8, power_draw: -30.0, revenue_per_tick: 550 }
    ]
  },
  {
    id: 'eclipse',
    name: 'Project Nexus (Procedural Cyber Matrix)',
    country: 'Global AI Hub 🌐',
    lat: 1.3521,
    lng: 103.8198,
    timezone: 'UTC',
    description: 'Autonomous futuristic cyberpunk city with procedural skyscrapers, Maglev transit, and AI neural core.',
    waterSide: 'south',
    landmarkType: 'cyber_spire',
    ambientTemp: '25°C',
    buildings: null // Generates default matrix layout
  }
];
