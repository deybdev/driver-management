document.addEventListener("DOMContentLoaded", () => {
  const pillToggleGroup = document.querySelector(".pill-toggle-group");
  const schedules = document.querySelectorAll(".booking-schedule");

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
