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

  // RESPONSIVE PILL TOGGLE
    const scheduleMap = {};
  schedules.forEach(schedule => {
    const title = schedule.querySelector(".header-table h3").textContent.toLowerCase();
    if (title.includes("pending")) scheduleMap.pending = schedule;
    if (title.includes("booking")) scheduleMap.booking = schedule;
    if (title.includes("coding")) scheduleMap.coding = schedule;
  });

  function showSchedule(type) {
    schedules.forEach(s => {
      if (window.innerWidth <= 768) {
        s.style.display = "none";
        s.classList.remove("active");
      } else {
        s.style.display = "";
      }
    });

    if (window.innerWidth <= 768 && scheduleMap[type]) {
      scheduleMap[type].style.display = "block";
      scheduleMap[type].classList.add("active");
    }
  }

  pillToggleGroup.addEventListener("change", e => showSchedule(e.target.value));

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      const active = pillToggleGroup.querySelector("input:checked");
      showSchedule(active ? active.value : "pending");
    } else {
      schedules.forEach(s => (s.style.display = ""));
    }
  });

  const pendingRadio = document.getElementById("pending-sched");
  if (pendingRadio) {
    pendingRadio.checked = true;
    showSchedule("pending");
  }

});
