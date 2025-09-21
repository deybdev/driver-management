document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar ul li");
  const statusBtn = document.getElementById("statusBtn");
  const statusText = statusBtn?.querySelector(".status-text");
  const messageItems = document.querySelectorAll(".message-item");
  const backButton = document.querySelector(".back-to-messages");
  const messagesSidebar = document.querySelector(".messages-sidebar");
  const chatArea = document.querySelector(".chat-area");

  // ACTIVE LINK SWITCHING
  if (menuItems) {
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  // Initialize with offline state (no class means offline)
  if (statusBtn && statusText) {
    statusBtn.addEventListener("click", () => {
      statusBtn.classList.toggle("online");
      statusText.textContent = statusBtn.classList.contains("online")
        ? "Online"
        : "Offline";
    });
  }

// INCOME CARDS SCROLL FUNCTIONALITY
function scrollIncomeCards(direction) {
  const container = document.getElementById("income-cards-container");
  const scrollAmount = 150;

  if (direction === "left") {
    container.scrollLeft -= scrollAmount;
  } else if (direction === "right") {
    container.scrollLeft += scrollAmount;
  }
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

    messageItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          showChatArea();
        }
      });
    });

    backButton.addEventListener('click', () => {
      showMessagesList();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        messagesSidebar.classList.remove('hide');
        chatArea.classList.remove('show');
      } else {
        showMessagesList();
      }
    });
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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      messagesSidebar.classList.remove("hide");
      chatArea.classList.remove("show");
    } else {
      showMessagesList();
    }
  });
});
