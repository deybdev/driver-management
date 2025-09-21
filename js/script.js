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

// Initialize with offline state (no class means offline)
statusBtn.addEventListener("click", () => {
    statusBtn.classList.toggle("online");
    statusText.textContent = statusBtn.classList.contains("online") ? "Online" : "Offline";
});

// INCOME CARDS SCROLL FUNCTIONALITY
function scrollIncomeCards(direction) {
  const container = document.getElementById('income-cards-container');
  const scrollAmount = 150;
  
  if (direction === 'left') {
    container.scrollLeft -= scrollAmount;
  } else if (direction === 'right') {
    container.scrollLeft += scrollAmount;
  }
}

