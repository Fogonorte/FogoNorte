/* =====================================================
   FogoNorte Engenharia — fogonorte.js
   Interatividade, animações e navegação do site
   ===================================================== */

(function () {
  'use strict';

  /* ─── DADOS DOS DEPOIMENTOS ──────────────────────────── */
  var testimonials = [
    {
      initial: 'C',
      name: 'Claucion Alves da Silva',
      role: 'Cliente FogoNorte',
      color: '#E84118',
      stars: 5,
      text: '"Agilidade e competência para atender a minha demanda, só tenho a agradecer pelo profissionalismo com que resolveu a minha situação. Recomendo a FogoNorte para todos que precisam de regularização!"'
    },
    {
      initial: 'J',
      name: 'José Marcelo',
      role: 'Cliente FogoNorte',
      color: '#E84118',
      stars: 5,
      text: '"Excelente atendimento! A equipe da FogoNorte foi extremamente profissional e rápida na regularização do meu estabelecimento junto ao CBMRO. Processo sem burocracia e com total transparência."'
    },
    {
      initial: 'M',
      name: 'Marcos Pereira',
      role: 'Gerente Comercial',
      color: '#2ECC40',
      stars: 5,
      text: '"Contratamos a FogoNorte para regularização de toda a nossa rede em Rondônia. Serviço impecável, documentação completa e sem dor de cabeça. Uma empresa que entrega o que promete!"'
    },
    {
      initial: 'G',
      name: 'Guilherme Campos Correa',
      role: 'Cliente FogoNorte',
      color: '#E84118',
      stars: 5,
      text: '"Profissionalismo e dedicação do início ao fim. O projeto de prevenção contra incêndio foi aprovado sem nenhuma ressalva pelo Corpo de Bombeiros. Muito obrigado pela atenção e qualidade!"'
    },
    {
      initial: 'R',
      name: 'Rosângela Matos',
      role: 'Proprietária',
      color: '#2ECC40',
      stars: 5,
      text: '"Atendimento personalizado, preço justo e entrega dentro do prazo. A FogoNorte me ajudou a regularizar meu imóvel comercial sem complicações. Com certeza vou indicar para meus parceiros!"'
    }
  ];

  var currentTestimonial = 0;
  var testimonialTimer = null;
  var progressTimer = null;

  /* ─── UTILITÁRIOS ────────────────────────────────────── */
  function scrollTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var headerH = document.querySelector('header') ? document.querySelector('header').offsetHeight : 80;
    var top = el.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* ─── HEADER COM SCROLL ──────────────────────────────── */
  function initHeader() {
    var header = document.querySelector('header');
    if (!header) return;

    // Adiciona classe na logo para controle de filtro
    var logo = header.querySelector('img');
    if (logo) logo.classList.add('fn-logo-img');

    // Adiciona classe no botão mobile
    var menuBtn = header.querySelector('button.md\\:hidden, button[class*="md:hidden"]');
    if (menuBtn) menuBtn.classList.add('fn-menu-btn');

    // Adiciona classe no botão CTA
    var ctaBtn = header.querySelector('button.hidden.md\\:block, button[class*="hidden md:block"]');
    if (ctaBtn) ctaBtn.classList.add('fn-header-cta');

    function updateHeader() {
      if (window.scrollY > 60) {
        header.classList.add('fn-header-scrolled');
      } else {
        header.classList.remove('fn-header-scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ─── NAVEGAÇÃO — BOTÕES LINKADOS ───────────────────── */
  function initNavigation() {
    // Mapeamento de texto do botão → id da seção
    var navLinks = {
      'Serviços': 'servicos',
      'Sobre': 'sobre',
      'Depoimentos': 'depoimentos',
      'Contato': 'contato',
      'Sobre Nós': 'sobre',
      'Nossos Serviços': 'servicos',
      'Solicitar Orçamento': 'contato',
      'Solicitar Orçamento Gratuito': 'contato',
      'Entre em Contato': 'contato',
    };

    // Aplica em todos os botões da página
    document.querySelectorAll('button').forEach(function (btn) {
      // Ignora botões dentro do formulário
      if (btn.closest('form')) return;

      var text = btn.textContent.trim();

      if (navLinks[text]) {
        var targetId = navLinks[text];
        btn.addEventListener('click', function () {
          scrollTo(targetId);
          closeMobileNav();
        });
      }

      // Botão "Falar com Especialista" → abre WhatsApp
      if (text === 'Falar com Especialista') {
        btn.addEventListener('click', function () {
          window.open('https://wa.me/5569992172327', '_blank');
        });
      }
    });

    // Também no footer
    document.querySelectorAll('footer button').forEach(function (btn) {
      var text = btn.textContent.trim();
      if (navLinks[text]) {
        btn.addEventListener('click', function () {
          scrollTo(navLinks[text]);
        });
      }
    });

    // Logo → volta ao topo
    var logo = document.querySelector('header .flex.items-center.gap-3.cursor-pointer');
    if (logo) {
      logo.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ─── INDICADOR DE SEÇÃO ATIVA NO NAV ───────────────── */
  function initActiveNav() {
    var sections = ['servicos', 'sobre', 'depoimentos', 'contato'];
    var navBtns = document.querySelectorAll('header nav button');

    var labelMap = {
      'servicos': 'Serviços',
      'sobre': 'Sobre',
      'depoimentos': 'Depoimentos',
      'contato': 'Contato'
    };

    function updateActive() {
      var scrollY = window.scrollY + 120;
      var active = '';

      sections.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) active = id;
      });

      navBtns.forEach(function (btn) {
        var text = btn.textContent.trim();
        btn.classList.toggle('fn-nav-active', active && labelMap[active] === text);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ─── MENU MOBILE ────────────────────────────────────── */
  var mobileNavEl = null;

  function closeMobileNav() {
    if (!mobileNavEl) return;
    mobileNavEl.classList.remove('fn-mobile-nav--open');
    setTimeout(function () {
      if (mobileNavEl && mobileNavEl.parentNode) {
        mobileNavEl.parentNode.removeChild(mobileNavEl);
      }
      mobileNavEl = null;
    }, 350);
  }

  function initMobileMenu() {
    var menuBtn = document.querySelector('header button.md\\:hidden, header button[class*="md:hidden"]');
    if (!menuBtn) return;

    menuBtn.addEventListener('click', function () {
      if (mobileNavEl) { closeMobileNav(); return; }

      mobileNavEl = document.createElement('div');
      mobileNavEl.className = 'fn-mobile-nav';

      var links = [
        { text: 'Serviços', target: 'servicos' },
        { text: 'Sobre', target: 'sobre' },
        { text: 'Depoimentos', target: 'depoimentos' },
        { text: 'Contato', target: 'contato' },
      ];

      var nav = document.createElement('div');
      nav.className = 'fn-mobile-links';

      links.forEach(function (l) {
        var btn = document.createElement('button');
        btn.textContent = l.text;
        btn.addEventListener('click', function () {
          closeMobileNav();
          setTimeout(function () { scrollTo(l.target); }, 200);
        });
        nav.appendChild(btn);
      });

      var divider = document.createElement('hr');
      divider.className = 'fn-mobile-divider';
      nav.appendChild(divider);

      var cta = document.createElement('button');
      cta.textContent = 'Solicitar Orçamento';
      cta.className = 'fn-cta-mobile';
      cta.addEventListener('click', function () {
        closeMobileNav();
        setTimeout(function () { scrollTo('contato'); }, 200);
      });
      nav.appendChild(cta);

      mobileNavEl.appendChild(nav);
      document.body.appendChild(mobileNavEl);

      // Clique fora fecha
      mobileNavEl.addEventListener('click', function (e) {
        if (e.target === mobileNavEl) closeMobileNav();
      });

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mobileNavEl.classList.add('fn-mobile-nav--open');
        });
      });
    });
  }

  /* ─── DEPOIMENTOS ────────────────────────────────────── */
  function buildTestimonialHTML(t) {
    var stars = '';
    for (var i = 0; i < t.stars; i++) {
      stars += '<i class="ri-star-fill text-lg" style="color:' + t.color + ';"></i>';
    }
    return (
      '<div class="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-colors duration-500" style="background-color:' + t.color + ';"></div>' +
      '<div class="flex flex-col md:flex-row gap-8 items-start">' +
        '<div class="flex-shrink-0">' +
          '<div class="w-16 h-16 flex items-center justify-center rounded-2xl text-white text-2xl font-extrabold transition-colors duration-500" style="background-color:' + t.color + ';">' + t.initial + '</div>' +
        '</div>' +
        '<div class="flex-1">' +
          '<div class="flex gap-1 mb-4">' + stars + '</div>' +
          '<p class="text-white text-lg md:text-xl leading-relaxed mb-6 italic">' + t.text + '</p>' +
          '<div><p class="text-white font-bold text-base">' + t.name + '</p><p class="text-white/50 text-sm">' + t.role + '</p></div>' +
        '</div>' +
      '</div>' +
      '<div id="fn-testimonial-progress"></div>'
    );
  }

  function updateThumbButtons(idx) {
    var thumbBtns = document.querySelectorAll('#depoimentos .fn-thumb-btn');
    thumbBtns.forEach(function (btn, i) {
      var avatarDiv = btn.querySelector('div');
      var t = testimonials[i];
      if (i === idx) {
        btn.style.borderColor = t.color;
        btn.classList.add('fn-thumb-active');
        if (avatarDiv) { avatarDiv.style.backgroundColor = t.color; avatarDiv.style.color = '#fff'; }
      } else {
        btn.style.borderColor = '#e5e7eb';
        btn.classList.remove('fn-thumb-active');
        if (avatarDiv) { avatarDiv.style.backgroundColor = '#f3f3f3'; avatarDiv.style.color = '#666'; }
      }
    });
  }

  function showTestimonial(idx, instant) {
    var box = document.getElementById('fn-testimonial-box');
    if (!box) return;

    currentTestimonial = idx;

    if (instant) {
      box.innerHTML = buildTestimonialHTML(testimonials[idx]);
      box.classList.remove('fn-fading', 'fn-appearing');
      startProgress();
      updateThumbButtons(idx);
      return;
    }

    // Fade out
    box.classList.add('fn-fading');
    box.classList.remove('fn-appearing');

    setTimeout(function () {
      box.innerHTML = buildTestimonialHTML(testimonials[idx]);
      box.classList.remove('fn-fading');
      box.classList.add('fn-appearing');
      startProgress();
      updateThumbButtons(idx);
    }, 320);
  }

  function startProgress() {
    var bar = document.getElementById('fn-testimonial-progress');
    if (!bar) return;
    bar.classList.remove('fn-progressing');
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bar.classList.add('fn-progressing');
      });
    });
  }

  function nextTestimonial() {
    var next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next, false);
  }

  function resetTimer() {
    if (testimonialTimer) clearInterval(testimonialTimer);
    testimonialTimer = setInterval(nextTestimonial, 3000);
  }

  function initTestimonials() {
    // Encontra o container principal dos depoimentos e converte para o novo formato
    var section = document.getElementById('depoimentos');
    if (!section) return;

    // Pega o bloco escuro (onde fica o depoimento)
    var darkBox = section.querySelector('.bg-\\[\\#1A1A1A\\]');
    if (!darkBox) return;

    // Cria o wrapper com id para controle
    darkBox.id = 'fn-testimonial-box';
    darkBox.innerHTML = buildTestimonialHTML(testimonials[0]);

    // Adiciona classes fn-thumb-btn nos botões de seleção
    var thumbBtns = section.querySelectorAll('.flex.flex-wrap.gap-3 button');
    thumbBtns.forEach(function (btn, i) {
      btn.classList.add('fn-thumb-btn');
      btn.addEventListener('click', function () {
        showTestimonial(i, false);
        resetTimer();
      });
    });

    updateThumbButtons(0);
    resetTimer();
  }

  /* ─── SCROLL REVEAL ──────────────────────────────────── */
  function initScrollReveal() {
    var targets = [];

    // Seções — revela os filhos diretos com delay
    var sections = ['#servicos', '#sobre', '#depoimentos', '#contato'];
    sections.forEach(function (sel) {
      var sec = document.querySelector(sel);
      if (!sec) return;
      var children = sec.querySelectorAll(':scope > div > div, :scope > div > .grid > div, :scope > div > .flex > .flex-1');
      children.forEach(function (el, i) {
        if (!el.classList.contains('fn-reveal')) {
          el.classList.add('fn-reveal');
          if (i === 1) el.classList.add('fn-reveal-delay-1');
          if (i === 2) el.classList.add('fn-reveal-delay-2');
          if (i === 3) el.classList.add('fn-reveal-delay-3');
        }
        targets.push(el);
      });
    });

    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fn-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ─── CLASSES HELPER NO HERO ────────────────────────── */
  function initHeroClasses() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var content = hero.querySelector('.flex-1');
    if (content) content.classList.add('fn-hero-content');
    var card = hero.querySelector('.lg\\:min-w-\\[360px\\]');
    if (card) card.classList.add('fn-hero-card');
  }

  /* ─── PROGRESS BAR DE LEITURA ───────────────────────── */
  function initProgressBar() {
    var bar = document.getElementById('fn-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ─── FORMULÁRIO — contador de chars ────────────────── */
  function initForm() {
    var textarea = document.querySelector('textarea[name="mensagem"]');
    var counter = document.querySelector('.text-right.text-gray-400');
    if (textarea && counter) {
      textarea.addEventListener('input', function () {
        counter.textContent = this.value.length + '/500';
      });
    }
  }

  /* ─── INICIALIZAÇÃO ──────────────────────────────────── */
  function init() {
    initHeader();
    initNavigation();
    initActiveNav();
    initMobileMenu();
    initHeroClasses();
    initTestimonials();
    initScrollReveal();
    initProgressBar();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
