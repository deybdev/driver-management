const menuItems = document.querySelectorAll(".sidebar ul li");
const statusBtn = document.getElementById("statusBtn");
const statusText = statusBtn.querySelector(".status-text");

// ACTIVE LINK SWITCHING
document.addEventListener("DOMContentLoaded", () => {
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
});

statusBtn.addEventListener("click", () => {
  statusBtn.classList.toggle("online");

  if (statusBtn.classList.contains("online")) {
    statusText.textContent = "Online";
  } else {
    statusText.textContent = "Offline";
  }
});
