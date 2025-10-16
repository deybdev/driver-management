document.addEventListener('DOMContentLoaded', () => {
  const walletHeader = document.querySelector('.wallet-header');
  const mobileNav = document.querySelector('.mobile-nav-buttons');
  const sections = document.querySelectorAll('[data-mobile-section]');
  const backBtns = document.querySelectorAll('.back-btn');
  let isDetail = false, scrollY = 0;

  const toggle = (el, d) => el && (el.style.display = d);

  const showDetail = (section) => {
    if (window.innerWidth > 768) return;
    isDetail = true;
    toggle(walletHeader, 'none'); toggle(mobileNav, 'none');
    sections.forEach(s => s.style.display = 'none');
    const t = document.querySelector(`[data-mobile-section="${section}"]`);
    if (t) { toggle(t, 'block'); t.classList.add('mobile-detail-view'); toggle(t.querySelector('.back-btn'), 'flex'); }
  };

  const showMain = () => {
    if (window.innerWidth > 768) return;
    isDetail = false;
    toggle(walletHeader, 'block'); toggle(mobileNav, 'flex');
    backBtns.forEach(b => toggle(b, 'none'));
    sections.forEach(s => { s.classList.remove('mobile-detail-view'); s.style.display = 'none'; });
  };

  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    if (!btn.id.includes('cashout') && !btn.id.includes('topup')) {
      btn.addEventListener('click', () => showDetail(btn.dataset.section));
    }
  });
  backBtns.forEach(b => b.addEventListener('click', showMain));

  const resize = () => {
    if (window.innerWidth <= 768) { if (!isDetail) showMain(); }
    else { toggle(walletHeader,'block'); toggle(mobileNav,'none'); sections.forEach(s=>{s.style.display='block';s.classList.remove('mobile-detail-view');}); backBtns.forEach(b=>toggle(b,'none')); isDetail=false; }
  };
  window.addEventListener('resize', resize); resize();

  const open = (id) => {
    scrollY = window.pageYOffset;
    const m = document.getElementById(id); if (!m) return;
    m.classList.add('show'); document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
  };
  const close = (id) => {
    const m = document.getElementById(id); if (!m) return;
    m.classList.remove('show'); document.body.classList.remove('modal-open');
    document.body.style.top = ''; window.scrollTo(0, scrollY);
  };

  document.addEventListener('click', e => {
    const openBtn = e.target.closest('[data-open]');
    const closeBtn = e.target.closest('[data-close]');
    if (openBtn) open(openBtn.dataset.open);
    if (closeBtn) close(closeBtn.dataset.close);
    const m = e.target.classList.contains('modal') && e.target;
    if (m) close(m.id);

    // Handle payment option clicks
    const paymentOption = e.target.closest('.payment-option');
    if (paymentOption) {
      const paymentType = paymentOption.dataset.payment;
      if (paymentType) {
        // Close the add-payment-modal
        close('add-payment-modal');
        // Open the specific payment method modal
        setTimeout(() => {
          open(`${paymentType}-modal`);
        }, 300);
      }
    }
  });
  // Quick amount buttons
  const topUp = document.getElementById('topup-modal');
  if (topUp) {
    const input = topUp.querySelector('.amount-field');
    topUp.addEventListener('click', e => {
      if (e.target.classList.contains('quick-amount-btn')) {
        topUp.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        input.value = e.target.textContent.replace('₱','');
      }
    });
  }

  // Handle payment method form submissions
  document.querySelectorAll('.payment-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get the modal ID
      const modal = form.closest('.modal');
      const modalId = modal ? modal.id : '';
      const paymentMethod = modalId.replace('-modal', '');
      
      // Here you would normally send the data to your backend
      // For now, we'll just show a success message and close the modal
      alert(`${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} payment method added successfully!`);
      
      // Close the modal
      if (modalId) {
        close(modalId);
      }
      
      // Reset the form
      form.reset();
    });
  });
});
