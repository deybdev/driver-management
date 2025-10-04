async function geocode(place) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}`
  );
  const data = await res.json();
  if (!data.length) throw new Error("Location not found: " + place);
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      alert(`Your Location:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
      console.log("My Location:", latitude, longitude);
    },
    (err) => {
      alert("Error getting location: " + err.message);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

let mapInstance = null;

async function initMap(containerId) {
  // Clear existing map if it exists
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // Wait a bit to ensure container is visible and has dimensions
  await new Promise((resolve) => setTimeout(resolve, 100));

  const pickupName = document
    .getElementById("pickup-location")
    .textContent.trim();
  const dropoffName = document
    .getElementById("drpoff-location")
    .textContent.trim();

  const pickup = await geocode(pickupName);
  const dropoff = await geocode(dropoffName);

  // Initialize map with proper options
  mapInstance = L.map(containerId, {
    zoomControl: true,
    attributionControl: false,
    maxZoom: 18,
    minZoom: 3,
  });

  L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
  }).addTo(mapInstance);

  // Invalidate size to ensure proper rendering
  setTimeout(() => {
    mapInstance.invalidateSize();
    mapInstance.fitBounds(L.latLngBounds([pickup, dropoff]), {
      padding: [20, 20],
      maxZoom: 16,
    });
  }, 200);

  const icon = (color) =>
    new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
      iconSize: [30, 45],
      iconAnchor: [15, 45],
    });

  L.marker(pickup, { icon: icon("blue") })
    .addTo(mapInstance)
    .bindPopup("Pickup: " + pickupName);
  L.marker(dropoff, { icon: icon("red") }).addTo(mapInstance);

  const routing = L.Routing.control({
    waypoints: [L.latLng(pickup), L.latLng(dropoff)],
    lineOptions: { styles: [{ color: "#4285F4", weight: 5 }] },
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false, // Changed to false to prevent auto-zoom conflicts
    createMarker: () => null,
    show: false,
  }).addTo(mapInstance);

  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>.leaflet-routing-container{display:none!important;}</style>`
  );

  mapInstance.zoomControl.setPosition("topleft");

  routing.on("routesfound", (e) => {
    const km = (e.routes[0].summary.totalDistance / 1000).toFixed(0);
    const label = L.divIcon({
      className: "dropoff-label",
      html: `
      <div style="display: inline-flex; background:white;padding:5px;border-radius:8px;text-align:center;
                  box-shadow:0 4px 10px rgba(0,0,0,0.2);font-family:Arial;">
        <div style="display:flex;align-items:center;gap:8px;padding:5px 10px;">
          <div style="font-size:1.5rem;font-weight:700;color:#000">${km}</div>
          <div style="text-align:start">
            <div style="font-size:0.9rem;color:#7e7e7e">km</div>
            <div style="font-size:0.9rem;color:#7e7e7e">away</div>
          </div>
        </div>
      </div>`,
    });
    L.marker(dropoff, { icon: label }).addTo(mapInstance);
  });
}

// Function to initialize map when modal opens
window.initModalMap = function () {
  initMap("map");
};

// Don't auto-initialize the map on page load
// initMap("map"); // Removed this line
