let mapInstance, routing;
export let isPickedup = false;
const token = "pk.4524d26c6ef55e163b2ec8f30d698822";

export function setPickedup(value) {
  isPickedup = value;
}

let pickup, dropoff, currentLocation, pickupName, dropoffName;

async function geocode(place) {
  const res = await fetch(
    `https://us1.locationiq.com/v1/search.php?key=${token}&q=${encodeURIComponent(
      place
    )}&format=json`
  );
  const data = await res.json();
  if (!data.length) throw new Error("Location not found");
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      (err) => reject("Error: " + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export async function initMap(containerId) {
  if (mapInstance) mapInstance.remove();

  pickupName = document.getElementById("pickup-location").textContent.trim();
  dropoffName = document.getElementById("dropoff-location").textContent.trim();

  [pickup, dropoff, currentLocation] = await Promise.all([
    geocode(pickupName),
    geocode(dropoffName),
    getCurrentLocation(),
  ]);

  mapInstance = L.map(containerId, { maxZoom: 18, minZoom: 3 }).setView(
    currentLocation,
    14
  );

  L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
    }
  ).addTo(mapInstance);

  renderMap();
}

export const renderMap = function renderRoute() {
  if (routing) mapInstance.removeControl(routing);

  const bounds = L.latLngBounds(
    !isPickedup ? [currentLocation, pickup] : [currentLocation, dropoff]
  );
  mapInstance.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });

  // Define icons
  const icon = (color) =>
    L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
      iconSize: [30, 45],
      iconAnchor: [15, 45],
    });

  const currentIcon = L.icon({
    iconUrl: "../assets/car-icon.png",
    iconSize: [70, 70],
    iconAnchor: [30, 30],
  });

  // Remove existing markers
  mapInstance.eachLayer((layer) => {
    if (
      layer instanceof L.Marker &&
      !layer._icon.classList.contains("leaflet-control-zoom")
    ) {
      mapInstance.removeLayer(layer);
    }
  });

  // Add markers
  L.marker(currentLocation, { icon: currentIcon })
    .addTo(mapInstance)
    .bindPopup("Current Location");

  L.marker(!isPickedup ? pickup : dropoff, { icon: icon("red") }).addTo(
    mapInstance
  );

  // Routing
  routing = L.Routing.control({
    waypoints: !isPickedup
      ? [L.latLng(currentLocation), L.latLng(pickup)]
      : [L.latLng(currentLocation), L.latLng(dropoff)],
    lineOptions: { styles: [{ color: "rgb(63, 86, 44)", weight: 5 }] },
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false,
    createMarker: () => null,
    show: false,
  }).addTo(mapInstance);

  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>.leaflet-routing-container{display:none!important;}</style>`
  );

  routing.on("routesfound", (e) => {
    const { totalDistance, totalTime } = e.routes[0].summary;
    const km = (totalDistance / 1000).toFixed(0);
    const mins = Math.round(totalTime / 60);
    const hours = Math.floor(mins / 60);
    const eta = hours ? `${hours}h ${mins % 60}m` : `${mins} mins`;

    const label = L.divIcon({
      className: "dropoff-label",
      html: `
        <div style="background:#fff;padding:10px 16px;border-radius:10px;
          box-shadow:0 4px 12px rgba(0,0,0,.15);font-family:Arial;min-width:140px">
          <div style="font-size:1.2rem;font-weight:700;color:#222">${km} km</div>
          <div style="font-size:.95rem;color:#555">
            ETA: <span style="font-weight:600;color:#000">${eta}</span>
          </div>
        </div>`,
    });

    L.marker(!isPickedup ? pickup : dropoff, { icon: label }).addTo(
      mapInstance
    );
  });
};
