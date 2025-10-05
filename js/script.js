document.addEventListener("DOMContentLoaded", () => {
  // Get all DOM elements
  const menuItems = document.querySelectorAll(".sidebar ul li");
  const statusBtn = document.getElementById("statusBtn");
  const statusText = statusBtn?.querySelector(".status-text");
  const messageItems = document.querySelectorAll(".message-item");
  const backButton = document.querySelector(".back-to-messages");
  const messagesSidebar = document.querySelector(".messages-sidebar");
  const chatArea = document.querySelector(".chat-area");
  const messageForm = document.getElementById("messageForm");
  const chatMessages = document.querySelector(".chat-messages");
  const pillToggleGroup = document.querySelector(".pill-toggle-group");
  const schedules = document.querySelectorAll(".booking-schedule");
  const detailsButtons = document.querySelectorAll(".details-btn");
  const modal = document.getElementById("detailsModal");
  const closeButton = document.querySelector(".close-modal");

  // MESSAGE SENDING
  if (messageForm) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = messageForm.querySelector("input");
      const message = input.value.trim();

      if (message) {
        const newMessage = document.createElement("div");
        newMessage.className = "message-bubble sent";

        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        newMessage.innerHTML = `
          <p>${message}</p>
          <span class="message-time">${time}</span>
        `;

        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        input.value = "";
      }
    });
  }

  // ACTIVE LINK SWITCHING
  if (menuItems) {
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  if (statusBtn && statusText) {
    statusBtn.addEventListener("click", () => {
      statusBtn.classList.toggle("online");
      statusText.textContent = statusBtn.classList.contains("online")
        ? "Online"
        : "Offline";
    });
  }

  // RESPONSIVE MESSAGE AREA
  if (messageItems && backButton && messagesSidebar && chatArea) {
    function showChatArea() {
      messagesSidebar.classList.add("hide");
      chatArea.classList.add("show");
    }

    function showMessagesList() {
      messagesSidebar.classList.remove("hide");
      chatArea.classList.remove("show");
    }

    if (window.innerWidth <= 768) {
      showMessagesList();
    }

    messageItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          showChatArea();
        }
      });
    });

    backButton.addEventListener("click", () => {
      showMessagesList();
    });

    const chatInput = document.querySelector(".chat-input input");
    let isInputFocused = false;

    if (chatInput) {
      chatInput.addEventListener("focus", () => {
        isInputFocused = true;
      });

      chatInput.addEventListener("blur", () => {
        isInputFocused = false;
      });
    }

    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (lastWidth !== window.innerWidth && !isInputFocused) {
        lastWidth = window.innerWidth;
        if (window.innerWidth > 768) {
          messagesSidebar.classList.remove("hide");
          chatArea.classList.remove("show");
        } else {
          if (!chatArea.classList.contains("show")) {
            showMessagesList();
          }
        }
      }
    });
  }

  // MODAL FUNCTIONALITY FOR DETAILS BUTTON
  if (detailsButtons && modal) {
    detailsButtons.forEach((button) => {
      button.addEventListener("click", function () {
        modal.style.display = "flex";
        // Initialize map when modal opens
        if (typeof window.initModalMap === 'function') {
          setTimeout(() => {
            window.initModalMap();
          }, 100);
        }
      });
    });
  }

  // Close modal when X button is clicked
  if (closeButton && modal) {
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside the modal content
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
      modal.style.display = "none";
    }
  });

  // SCHEDULE TAB FUNCTIONALITY
  const scheduleTabGroup = document.querySelector(".pill-toggle-group");
  const bookingsSection = document.getElementById("bookings-section");
  const ongoingSection = document.getElementById("ongoing-section");
  const historySection = document.getElementById("history-section");

  function showScheduleSection(activeTab) {
    // Hide all sections
    if (bookingsSection) bookingsSection.style.display = "none";
    if (ongoingSection) ongoingSection.style.display = "none";
    if (historySection) historySection.style.display = "none";

    // Show the active section
    switch (activeTab) {
      case "bookings":
        if (bookingsSection) bookingsSection.style.display = "block";
        break;
      case "ongoing":
        if (ongoingSection) ongoingSection.style.display = "block";
        break;
      case "history":
        if (historySection) historySection.style.display = "block";
        break;
    }
  }

  // Add event listeners to schedule tabs
  if (scheduleTabGroup) {
    scheduleTabGroup.addEventListener("change", (e) => {
      if (e.target.type === "radio") {
        showScheduleSection(e.target.value);
      }
    });

    // Initialize with bookings tab active
    showScheduleSection("bookings");
  }
});

// FUNCTIONS
function openInGoogleMaps(button) {
  const locationName = button.closest(".route-item").querySelector(".location-name").innerText;
  const encoded = encodeURIComponent(locationName);
  window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank");
}

