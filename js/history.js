document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching Functionality
  const feedbackTabs = document.querySelectorAll('.feedback-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  feedbackTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      feedbackTabs.forEach(t => t.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Show corresponding panel
      const tabId = tab.dataset.tab;
      const panel = document.getElementById(tabId);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  // Search Functionality for Booking Records
  const bookingSearchInput = document.querySelector('#booking-records .search-input');
  if (bookingSearchInput) {
    bookingSearchInput.addEventListener('input', () => {
      filterBookingRecords();
    });
  }

  // Status Filter for Booking Records
  const statusFilter = document.querySelector('.status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      filterBookingRecords();
    });
  }

  // Filter Booking Records Function
  function filterBookingRecords() {
    const searchTerm = document.querySelector('#booking-records .search-input')?.value.toLowerCase() || '';
    const selectedStatus = document.querySelector('.status-filter')?.value || 'all';
    
    const rows = document.querySelectorAll('.booking-table tbody tr');

    rows.forEach(row => {
      const name = row.cells[1]?.textContent.toLowerCase() || '';
      const passenger = row.cells[2]?.textContent.toLowerCase() || '';
      const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';

      const matchesSearch = name.includes(searchTerm) || passenger.includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

      if (matchesSearch && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Rating Filter Functionality for Passenger Feedback
  const ratingFilter = document.querySelector('#passenger-feedback .rating-filter');
  if (ratingFilter) {
    ratingFilter.addEventListener('change', (e) => {
      const selectedRating = e.target.value;
      const feedbackItems = document.querySelectorAll('.feedback-item');

      feedbackItems.forEach(item => {
        if (selectedRating === 'all') {
          item.style.display = 'flex';
        } else {
          const stars = item.querySelectorAll('.star-filled').length;
          if (stars === parseInt(selectedRating)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        }
      });
    });
  }

  // Search Functionality for Complaints
  const complaintsSearchInput = document.querySelector('#reports-complaints .search-input');
  if (complaintsSearchInput) {
    complaintsSearchInput.addEventListener('input', () => {
      filterComplaints();
    });
  }

  // Priority Filter for Complaints
  const priorityFilter = document.querySelector('.priority-filter');
  if (priorityFilter) {
    priorityFilter.addEventListener('change', () => {
      filterComplaints();
    });
  }

  // Rating Filter for Complaints
  const complaintsRatingFilter = document.querySelector('#reports-complaints .rating-filter');
  if (complaintsRatingFilter) {
    complaintsRatingFilter.addEventListener('change', () => {
      filterComplaints();
    });
  }

  // Filter Complaints Function
  function filterComplaints() {
    const searchTerm = document.querySelector('#reports-complaints .search-input')?.value.toLowerCase() || '';
    const selectedPriority = document.querySelector('.priority-filter')?.value || 'all';
    const selectedRating = document.querySelector('#reports-complaints .rating-filter')?.value || 'all';
    
    const rows = document.querySelectorAll('.complaints-table tbody tr');

    rows.forEach(row => {
      const passenger = row.cells[1]?.textContent.toLowerCase() || '';
      const complaintType = row.cells[2]?.textContent.toLowerCase() || '';
      const description = row.cells[3]?.textContent.toLowerCase() || '';
      const priority = row.querySelector('.priority-badge')?.textContent.toLowerCase() || '';

      const matchesSearch = passenger.includes(searchTerm) || 
                           complaintType.includes(searchTerm) || 
                           description.includes(searchTerm);
      const matchesPriority = selectedPriority === 'all' || priority === selectedPriority;

      if (matchesSearch && matchesPriority) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
});
