// Sample booking data
const bookings = [
  // Available bookings
  {
    id: 1,
    type: "available",
    clientName: "John Smith",
    distance: "8.5 km",
    time: "Now",
    pickupAddress: "Quezon Memorial Circle",
    dropoffAddress: "Pasig City",
    note: "I'm waiting at the guardhouse near the main gate.",
    fare: "₱25.00",
    state: "not_accepted", // not_accepted, accepted, picked_up, dropped_off
  },
  {
    id: 2,
    type: "available",
    clientName: "Maria Santos",
    distance: "12.3 km",
    time: "October 12, 10:30AM",
    pickupAddress: "SM North EDSA",
    dropoffAddress: "Quezon City Hall",
    note: "Please pick me up",
    fare: "₱32.50",
    state: "not_accepted",
  },
  {
    id: 3,
    type: "available",
    clientName: "Anna Cruz",
    distance: "18.7 km",
    time: "March 3, 8:30PM",
    pickupAddress: "Ninoy Aquino Parks and Wildlife",
    dropoffAddress: "Novaliches QC",
    note: "No note provided",
    fare: "₱45.00",
    state: "not_accepted",
  },
  // Ongoing bookings
  {
    id: 4,
    type: "ongoing",
    clientName: "Michael Johnson",
    pickupAddress: "BGC Central Square",
    dropoffAddress: "Makati City      ",
    note: "I'm waiting at the guardhouse near the main gateasknboashsanp[apgponsa amsfpo].",
    fare: "₱85.00",
    state: "accepted", // Driver accepted, going to pickup
  },
];

// ===== HELPER FUNCTIONS =====

// Get the template card and clear old cards from container
function prepareContainer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Remove all existing cards except the template
  container.querySelectorAll(".booking-card:not(.template)").forEach(card => card.remove());

  // Get the template
  const template = container.querySelector(".booking-card.template");
  return { container, template };
}

// Create a card from template and fill with booking data
function createBookingCard(template, booking, fillFunction) {
  const card = template.cloneNode(true);
  card.style.display = "block";
  card.classList.remove("template");
  card.dataset.id = booking.id;

  // Fill the card with booking details
  fillFunction(card, booking);

  // Make card clickable to open details
  card.addEventListener("click", () => openDetailsModalWithBooking(booking));

  return card;
}

// Update Iconify icons after rendering
function refreshIcons() {
  if (window.Iconify) Iconify.scan();
}

// ===== CARD FILLING FUNCTIONS =====

function fillAvailableCard(card, booking) {
  card.querySelector(".distance").textContent = `${booking.distance} from you`;
  card.querySelector(".time").textContent = booking.time;
  card.querySelector(".client-name").textContent = booking.clientName;
  card.querySelector(".pickup-address").textContent = booking.pickupAddress;
  card.querySelector(".dropoff-address").textContent = booking.dropoffAddress;
  card.querySelector(".note-text").textContent = booking.note || "No note provided";
  card.querySelector(".fare").textContent = booking.fare;

  // Add accept button handler
  const acceptBtn = card.querySelector(".accept-btn");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Don't trigger card click
      
      // Store the booking that's being accepted
      window.acceptedBooking = booking;
      
      // Accept the booking
      booking.state = 'accepted';
      booking.type = 'ongoing';
      
      // Show acceptance confirmation modal
      openBookingAcceptedModal();
      
      // Refresh the bookings display to move it to ongoing
      renderAvailableBookings();
      renderOngoingBookings();
    });
  }
}

function fillOngoingCard(card, booking) {
  card.querySelector(".status-text").textContent = booking.status;
  card.querySelector(".client-name").textContent = booking.clientName;
  card.querySelector(".pickup-address").textContent = booking.pickupAddress;
  card.querySelector(".dropoff-address").textContent = booking.dropoffAddress;
  card.querySelector(".note-text").textContent = booking.note || "No note provided";
  card.querySelector(".fare").textContent = booking.fare;
}

// ===== RENDER FUNCTIONS =====

function renderAvailableBookings() {
  const { container, template } = prepareContainer("bookings-container");
  if (!container || !template) return;

  const availableBookings = bookings.filter(b => b.type === "available");

  availableBookings.forEach(booking => {
    const card = createBookingCard(template, booking, fillAvailableCard);
    container.appendChild(card);
  });

  refreshIcons();
}

function renderOngoingBookings() {
  const { container, template } = prepareContainer("ongoing-container");
  if (!container || !template) return;

  const ongoingBookings = bookings.filter(b => b.type === "ongoing");

  ongoingBookings.forEach(booking => {
    const card = createBookingCard(template, booking, fillOngoingCard);
    container.appendChild(card);
  });

  refreshIcons();
}

// ===== MODAL FUNCTIONS =====

async function openDetailsModalWithBooking(booking) {
  const modal = document.getElementById('detailsModal');
  if (!modal) return;

  // Update passenger avatar (initials)
  const avatarElement = modal.querySelector('.avatar-large');
  if (avatarElement) {
    const initials = booking.clientName.split(' ').map(n => n[0]).join('');
    avatarElement.textContent = initials;
  }

  // Update passenger name
  const nameElement = modal.querySelector('.passenger-text-info h3');
  if (nameElement) {
    nameElement.textContent = booking.clientName;
  }

  // Update pickup and dropoff locations
  const locations = modal.querySelectorAll('.location-name');
  if (locations[0]) locations[0].textContent = booking.pickupAddress;
  if (locations[1]) locations[1].textContent = booking.dropoffAddress;

  // Update fare
  const fareElement = modal.querySelector('.fare-amount');
  if (fareElement) {
    fareElement.textContent = booking.fare;
  }

  // Update note
  const noteElement = modal.querySelector('.details-note-text');
  if (noteElement) {
    noteElement.textContent = booking.note || 'No note provided';
  }

  // Update map locations
  const pickupElement = modal.querySelector('#pickup-location');
  if (pickupElement) {
    pickupElement.textContent = booking.pickupAddress;
  }

  const dropoffElement = modal.querySelector('#dropoff-location');
  if (dropoffElement) {
    dropoffElement.textContent = booking.dropoffAddress;
  }

  // Handle action buttons based on booking state
  const togglePickupBtn = modal.querySelector('#togglePickup');
  const cancelRideBtn = modal.querySelector('#cancelRide');

  if (togglePickupBtn && cancelRideBtn) {
    // Reset button states first
    togglePickupBtn.style.display = '';
    cancelRideBtn.style.display = '';
    togglePickupBtn.disabled = false;
    cancelRideBtn.disabled = false;
    togglePickupBtn.className = 'btn-completed';
    
    // Remove any existing event listeners by cloning the button
    const newToggleBtn = togglePickupBtn.cloneNode(true);
    togglePickupBtn.parentNode.replaceChild(newToggleBtn, togglePickupBtn);
    const finalToggleBtn = newToggleBtn;

    // State-based button configuration
    switch (booking.state) {
      case 'not_accepted':
        // Available booking - show Accept button
        finalToggleBtn.textContent = 'Accept Booking';
        finalToggleBtn.disabled = false;
        finalToggleBtn.className = 'btn-completed';
        cancelRideBtn.style.display = 'none';
        
        // Accept button click handler
        finalToggleBtn.addEventListener('click', function() {
          booking.state = 'accepted';
          booking.type = 'ongoing';
          closeModal('detailsModal');
          openBookingAcceptedModal();
          // Refresh the bookings display
          renderAvailableBookings();
          renderOngoingBookings();
        });
        break;

      case 'accepted':
        // Booking accepted - going to pickup
        finalToggleBtn.textContent = 'Arrived at Pickup Location';
        finalToggleBtn.disabled = false;
        finalToggleBtn.className = 'btn-completed';
        cancelRideBtn.style.display = 'block';
        cancelRideBtn.textContent = 'Cancel Booking';
        
        // Arrived at pickup click handler
        finalToggleBtn.addEventListener('click', function() {
          // Update modal for pickup confirmation
          const headerText = document.getElementById('headerText');
          const confirmationText = document.getElementById('confirmationText');
          const confirmArrivalBtn = document.getElementById('confirmArrivalBtn');
          const confirmDropoffBtn = document.getElementById('confirmDropoffBtn');
          
          if (headerText) headerText.textContent = 'Confirm Arrival';
          if (confirmationText) {
            confirmationText.textContent = "Are you sure you've arrived at the passenger's pickup location?";
          }
          
          // Show pickup button, hide dropoff button
          if (confirmArrivalBtn) confirmArrivalBtn.style.display = 'inline-block';
          if (confirmDropoffBtn) confirmDropoffBtn.style.display = 'none';
          
          // Open the modal
          if (typeof openModal === 'function') {
            openModal('arrivedPickupModal');
          }
        });
        
        // Cancel button handler
        cancelRideBtn.addEventListener('click', function() {
          if (confirm('Are you sure you want to cancel this booking?')) {
            booking.state = 'cancelled';
            booking.type = 'cancelled';
            closeModal('detailsModal');
            renderOngoingBookings();
          }
        });
        break;

      case 'picked_up':
        // Passenger picked up - going to dropoff
        finalToggleBtn.textContent = 'Arrived at Dropoff Location';
        finalToggleBtn.disabled = false;
        finalToggleBtn.className = 'btn-completed';
        cancelRideBtn.style.display = 'none'; // Hide cancel after pickup
        
        // Arrived at dropoff click handler
        finalToggleBtn.addEventListener('click', function() {
          // Update modal for dropoff confirmation
          const headerText = document.getElementById('headerText');
          const confirmationText = document.getElementById('confirmationText');
          const confirmArrivalBtn = document.getElementById('confirmArrivalBtn');
          const confirmDropoffBtn = document.getElementById('confirmDropoffBtn');
          
          if (headerText) headerText.textContent = 'Confirm Arrival';
          if (confirmationText) {
            confirmationText.textContent = "Are you sure you've arrived at the passenger's drop-off location?";
          }
          
          // Hide pickup button, show dropoff button
          if (confirmArrivalBtn) confirmArrivalBtn.style.display = 'none';
          if (confirmDropoffBtn) confirmDropoffBtn.style.display = 'inline-block';
          
          // Open the modal
          if (typeof openModal === 'function') {
            openModal('arrivedPickupModal');
          }
        });
        break;

      case 'completed':
        // Trip completed
        finalToggleBtn.textContent = 'Completed';
        finalToggleBtn.disabled = true;
        finalToggleBtn.className = 'btn-completed disabled';
        cancelRideBtn.style.display = 'none';
        break;

      case 'cancelled':
        // Trip cancelled
        finalToggleBtn.textContent = 'Cancelled';
        finalToggleBtn.disabled = true;
        finalToggleBtn.className = 'btn-cancel disabled';
        cancelRideBtn.style.display = 'none';
        break;

      default:
        // Fallback for undefined states
        finalToggleBtn.style.display = 'none';
        cancelRideBtn.style.display = 'none';
    }
  }

  // Store current booking for state updates
  window.currentBooking = booking;

  // Show the modal
  if (typeof openModal === 'function') {
    openModal('detailsModal');
  } else {
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }

  // Initialize map after modal is visible
  setTimeout(async () => {
    try {
      const { initMap } = await import('./map.js');
      await initMap('map');
    } catch (error) {
      // Show error message if map fails to load
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; 
                      background: #f5f5f5; color: #666; text-align: center; padding: 20px;">
            <div>
              <p>Map temporarily unavailable</p>
              <small>Error: ${error.message}</small>
            </div>
          </div>
        `;
      }
    }
  }, 300);
}

function openBookingAcceptedModal() {
  if (typeof openModal === 'function') {
    openModal("bookingAccepted");
  } else {
    const modal = document.getElementById("bookingAccepted");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("show");
      document.body.classList.add("modal-open");
    }
  }
}

function confirmBookingAndShowDetails() {
  // Close the acceptance modal
  if (typeof closeModal === 'function') {
    closeModal("bookingAccepted");
  } else {
    const acceptedModal = document.getElementById("bookingAccepted");
    if (acceptedModal) {
      acceptedModal.style.display = "";
      acceptedModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }
  }

  if (window.acceptedBooking) {
    const booking = window.acceptedBooking;
    
    openDetailsModalWithBooking(booking);
    
    setTimeout(() => {
      renderMap(booking.pickupAddress, booking.dropoffAddress);
    }, 100);
    
    window.acceptedBooking = null;
  }
}

// ===== INITIALIZATION =====

function initializeBookings() {
  renderAvailableBookings();
  renderOngoingBookings();
}

// Initialize when page is ready
document.addEventListener('DOMContentLoaded', () => setTimeout(initializeBookings, 100));
window.addEventListener('load', () => setTimeout(initializeBookings, 200));
if (document.readyState === 'complete') {
  initializeBookings();
}

// Make functions globally available
window.openDetailsModalWithBooking = openDetailsModalWithBooking;
window.openBookingAcceptedModal = openBookingAcceptedModal;
window.confirmBookingAndShowDetails = confirmBookingAndShowDetails;

// ===== STATE TRANSITION FUNCTIONS =====

// Function to handle pickup confirmation (called from HTML button)
window.confirmArrival = async function() {
  console.log('confirmArrival called');
  console.log('Current booking:', window.currentBooking);
  
  if (window.currentBooking && window.currentBooking.state === 'accepted') {
    console.log('Updating booking state to picked_up');
    window.currentBooking.state = 'picked_up';
    
    // Close confirmation modal
    if (typeof closeModal === 'function') {
      closeModal('arrivedPickupModal');
    }
    
    // Update the map to show route to dropoff
    try {
      const { setPickedup, renderMap } = await import('./map.js');
      if (setPickedup) setPickedup(true);
      if (renderMap) renderMap('map');
    } catch (err) {
      console.log('Map functions not available:', err);
    }
    
    // Refresh the modal to update button
    openDetailsModalWithBooking(window.currentBooking);
    
    // Refresh ongoing bookings display
    renderOngoingBookings();
  } else {
    console.error('Cannot confirm pickup - booking not in accepted state or booking not found');
    console.log('Current state:', window.currentBooking?.state);
  }
};

// Function to handle dropoff confirmation (called from HTML button)
window.confirmDropoffArrival = function() {
  console.log('confirmDropoffArrival called');
  console.log('Current booking:', window.currentBooking);
  
  if (window.currentBooking && window.currentBooking.state === 'picked_up') {
    console.log('Updating booking state to completed');
    window.currentBooking.state = 'completed';
    window.currentBooking.type = 'completed';
    
    // Close confirmation modal
    if (typeof closeModal === 'function') {
      closeModal('arrivedPickupModal');
    }
    
    // Update the modal to show completed state
    openDetailsModalWithBooking(window.currentBooking);
    
    // Refresh displays
    renderOngoingBookings();
  } else {
    console.error('Cannot confirm dropoff - booking not in picked_up state or booking not found');
    console.log('Current state:', window.currentBooking?.state);
  }
};