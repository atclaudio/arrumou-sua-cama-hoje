document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Earnings Calculator (USD & BRL + Network Multiplier)
  const hoursSlider = document.getElementById('calc-hours');
  const hoursDisplay = document.getElementById('calc-hours-display');
  const friendsSlider = document.getElementById('calc-friends');
  const friendsDisplay = document.getElementById('calc-friends-display');
  const periodBtns = document.querySelectorAll('.period-btn');
  
  const dailyDisplay = document.getElementById('calc-daily');
  const periodTotalDisplay = document.getElementById('calc-period-total');
  const periodDaysLabel = document.getElementById('calc-period-days-label');
  const monthlyDisplay = document.getElementById('calc-monthly');
  const teamBonusNote = document.getElementById('calc-team-bonus-note');

  let currentRateBrl = 25; // R$ 25,00/h (US$ 5,00)
  let currentRateUsd = 5;
  let teamRateBrl = 3.75; // Média da comissão V1 (~US$ 0.75 = R$ 3,75/h)
  let teamRateUsd = 0.75;
  let currentPeriod = 22; // default 22 dias
  let currentHours = 2; // default 2h/dia
  let currentFriends = 0; // default 0 amigos

  function formatBRL(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatUSD(val) {
    return `US$ ${Math.round(val)}`;
  }

  function calculateEarnings() {
    if (hoursSlider) {
      currentHours = parseInt(hoursSlider.value, 10);
      if (hoursDisplay) hoursDisplay.textContent = `${currentHours}h`;
    }

    if (friendsSlider) {
      currentFriends = parseInt(friendsSlider.value, 10);
      if (friendsDisplay) {
        friendsDisplay.textContent = currentFriends === 0 ? 'Apenas eu' : `${currentFriends} ${currentFriends === 1 ? 'amigo' : 'amigos'}`;
      }
    }

    // Produção pessoal
    const personalDailyBrl = currentHours * currentRateBrl;
    const personalDailyUsd = currentHours * currentRateUsd;

    // Comissão residual de rede (estimando 1h/dia por amigo)
    const teamDailyBrl = currentFriends * 1 * teamRateBrl;
    const teamDailyUsd = currentFriends * 1 * teamRateUsd;

    const totalDailyBrl = personalDailyBrl + teamDailyBrl;
    const totalDailyUsd = personalDailyUsd + teamDailyUsd;

    const totalPeriodBrl = totalDailyBrl * currentPeriod;
    const totalPeriodUsd = totalDailyUsd * currentPeriod;

    const totalMonthlyBrl = totalDailyBrl * 30;
    const totalMonthlyUsd = totalDailyUsd * 30;

    if (dailyDisplay) {
      dailyDisplay.innerHTML = `${formatBRL(totalDailyBrl)} <span class="text-xs text-purple-300 font-normal">(${formatUSD(totalDailyUsd)})</span>`;
    }

    if (periodTotalDisplay) {
      periodTotalDisplay.innerHTML = `${formatBRL(totalPeriodBrl)} <span class="text-xl sm:text-2xl text-purple-300 font-bold block sm:inline">(${formatUSD(totalPeriodUsd)})</span>`;
    }

    if (periodDaysLabel) {
      periodDaysLabel.textContent = `Em ${currentPeriod} dias:`;
    }

    if (monthlyDisplay) {
      monthlyDisplay.innerHTML = `${formatBRL(totalMonthlyBrl)} <span class="text-xs text-purple-300 font-normal">(${formatUSD(totalMonthlyUsd)})</span>`;
    }

    if (teamBonusNote) {
      if (currentFriends > 0) {
        teamBonusNote.innerHTML = `🔥 Inclui <strong>${formatBRL(teamDailyBrl * currentPeriod)} (${formatUSD(teamDailyUsd * currentPeriod)})</strong> de comissão residual em dólar da sua equipe!`;
        teamBonusNote.classList.remove('hidden');
      } else {
        teamBonusNote.classList.add('hidden');
      }
    }
  }

  if (hoursSlider) {
    hoursSlider.addEventListener('input', calculateEarnings);
  }

  if (friendsSlider) {
    friendsSlider.addEventListener('input', calculateEarnings);
  }

  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => {
        b.classList.remove('bg-purple-600', 'text-white', 'shadow-brand');
        b.classList.add('bg-white/5', 'text-gray-300', 'hover:bg-white/10');
      });
      btn.classList.remove('bg-white/5', 'text-gray-300', 'hover:bg-white/10');
      btn.classList.add('bg-purple-600', 'text-white', 'shadow-brand');
      currentPeriod = parseInt(btn.dataset.days, 10);
      calculateEarnings();
    });
  });

  // Initial calculation
  calculateEarnings();

  // 2. Copy Referral Code to Clipboard
  const copyBtn = document.getElementById('copy-code-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  const referralCode = 'MIMIX4B6AAC16D9FF4E36';

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(referralCode);
        } else {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = referralCode;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="text-green-400">Código Copiado!</span>
        `;
        copyBtn.classList.add('border-green-500/50', 'bg-green-500/10');

        if (copyFeedback) {
          copyFeedback.classList.remove('opacity-0', 'pointer-events-none');
          copyFeedback.classList.add('opacity-100');
        }

        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.classList.remove('border-green-500/50', 'bg-green-500/10');
          if (copyFeedback) {
            copyFeedback.classList.add('opacity-0', 'pointer-events-none');
            copyFeedback.classList.remove('opacity-100');
          }
        }, 3000);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    });
  }

  // 3. FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-trigger');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const content = item.nextElementSibling;
      const chevron = item.querySelector('.accordion-chevron');
      const isExpanded = item.getAttribute('aria-expanded') === 'true';

      // Close other accordions in the same list
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.setAttribute('aria-expanded', 'false');
          const otherContent = otherItem.nextElementSibling;
          const otherChevron = otherItem.querySelector('.accordion-chevron');
          if (otherContent) otherContent.classList.remove('open');
          if (otherChevron) otherChevron.classList.remove('rotate');
        }
      });

      // Toggle current
      if (isExpanded) {
        item.setAttribute('aria-expanded', 'false');
        if (content) content.classList.remove('open');
        if (chevron) chevron.classList.remove('rotate');
      } else {
        item.setAttribute('aria-expanded', 'true');
        if (content) content.classList.add('open');
        if (chevron) chevron.classList.add('rotate');
      }
    });
  });

  // 4. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 5. Sticky Navbar Transition on Scroll
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('glass-nav', 'shadow-2xl');
      header?.classList.remove('bg-transparent');
    } else {
      header?.classList.remove('glass-nav', 'shadow-2xl');
      header?.classList.add('bg-transparent');
    }
  });

  // 6. Video Audio Toggle
  const video = document.getElementById('tutorial-video');
  const soundBtn = document.getElementById('video-sound-btn');
  if (video && soundBtn) {
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        soundBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        `;
      } else {
        soundBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      }
    });
  }
});
