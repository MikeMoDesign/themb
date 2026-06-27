document.addEventListener('DOMContentLoaded', () => {
  initHashRouting();
  initPortfolioFilter();
  initMobileNav();
  initEmailObfuscation();
});

/* ==========================================================================
   Single-Page Hash Routing
   ========================================================================== */
function initHashRouting() {
  const sections = document.querySelectorAll('.nav-section');
  const navLinks = document.querySelectorAll('.nav-links a');

  function handleRoute() {
    const hash = window.location.hash;
    
    // Safely extract the ID from the hash (remove leading # and optional slashes)
    let cleanId = 'home';
    if (hash) {
      cleanId = hash.replace(/^#\/?/, '');
    }
    
    let targetSection = document.getElementById(cleanId);

    if (!targetSection) {
      targetSection = document.getElementById('home');
      cleanId = 'home';
    }

    // Hide all sections first
    sections.forEach(sec => {
      sec.classList.remove('active-section', 'visible-section');
    });

    // Show target section
    if (targetSection) {
      targetSection.classList.add('active-section');
      // Delay visibility to allow opacity transition
      setTimeout(() => {
        targetSection.classList.add('visible-section');
      }, 50);
    }

    // Update active nav link
    navLinks.forEach(link => {
      link.classList.remove('active');
      const hrefVal = link.getAttribute('href');
      if (hrefVal === `#${cleanId}` || hrefVal === hash) {
        link.classList.add('active');
      }
    });

    // Scroll to top on navigation change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Bind route handler
  window.addEventListener('hashchange', handleRoute);
  
  // Call once on page load
  handleRoute();
}

/* ==========================================================================
   Works Filtering
   ========================================================================== */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.work-item');

  if (!items.length) return;

  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'inline-block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px) scale(0.97)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
}

/* ==========================================================================
   Mobile Nav Menu Drawer Toggle
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const menu = document.getElementById('navLinks');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close when clicking nav items
  const items = menu.querySelectorAll('a');
  items.forEach(item => {
    item.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

/* ==========================================================================
   Email Obfuscation Decryption & Clipboard Copy
   ========================================================================== */
function initEmailObfuscation() {
  const emailBtn = document.getElementById('emailBtn');
  if (!emailBtn) return;
  
  const revUser = emailBtn.getAttribute('data-user');
  const revDomain = emailBtn.getAttribute('data-domain');
  
  if (revUser && revDomain) {
    const user = revUser.split('').reverse().join('');
    const domain = revDomain.split('').reverse().join('');
    const email = `${user}@${domain}`;
    
    const emailText = document.getElementById('emailText');
    if (emailText) {
      emailText.textContent = email;
    }
    
    let copyTimeout;
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        if (copyTimeout) clearTimeout(copyTimeout);
        
        // Measure and lock width to prevent layout shifts
        const currentWidth = emailBtn.getBoundingClientRect().width;
        emailBtn.style.width = `${currentWidth}px`;
        
        emailBtn.classList.add('copied');
        emailText.textContent = 'Copied!';
        
        copyTimeout = setTimeout(() => {
          emailBtn.classList.remove('copied');
          emailText.textContent = email;
          // Release locked width
          emailBtn.style.width = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }
}
