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
    .getElementById("starting-location")
    .textContent.trim();
  const dropoffName = document
    .getElementById("destination-location")
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

    // total time is in seconds → convert to minutes
    const totalSeconds = e.routes[0].summary.totalTime;
    const minutes = Math.round(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // format ETA
    let eta;
    if (hours > 0) {
      eta = `${hours}h ${mins}m`;
    } else {
      eta = `${mins} mins`;
    }

    const label = L.divIcon({
      className: "dropoff-label",
      html: `
      <div
        style="
          display: inline-block;
          background: #ffffff;
          padding: 10px 16px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-family: Arial, sans-serif;
          min-width: 140px;
        "
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          "
        >
          <div
            style="
              font-size: 1.2rem;
              font-weight: 700;
              color: #222;
              line-height: 1;
            "
          >
            ${km} km
          </div>
          <div style="font-size: 0.95rem; color: #555">
            ETA: <span style="font-weight: 600; color: #000">${eta}</span>
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
