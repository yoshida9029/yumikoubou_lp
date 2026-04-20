/* =============================================
   清響 弓工房 — main.js
   ============================================= */

'use strict';

// ─────────────────────────────────────────────
// ハンバーガー / モバイルナビ（右スライドドロワー）
// ─────────────────────────────────────────────
(function initMobileNav() {
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var overlay   = document.getElementById('mobileNavOverlay');
  var closeBtn  = document.getElementById('mobileNavClose');

  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // スクロール停止
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileNav.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // 閉じるボタン
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  // オーバーレイクリックで閉じる
  if (overlay) overlay.addEventListener('click', closeNav);

  // ナビリンククリックで閉じる
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  // Escキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeNav();
    }
  });
}());

// ─────────────────────────────────────────────
// アコーディオン
// ─────────────────────────────────────────────
(function initAccordion() {
  var btn  = document.getElementById('accordionBtn');
  var body = document.getElementById('accordionBody');
  if (!btn || !body) return;

  btn.addEventListener('click', function () {
    var open = body.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
}());

// ─────────────────────────────────────────────
// スクロールフェードイン
// ─────────────────────────────────────────────
(function initFadeIn() {
  var targets = document.querySelectorAll('.js-fade');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { io.observe(el); });
}());

// ─────────────────────────────────────────────
// 予約フォーム
//
// 弓の強さ範囲：
//   並寸   : 8〜20 kg
//   伸寸   : 11〜20 kg
//   四寸伸 : 11〜20 kg
//   三寸詰 : 8〜18 kg
//
// 単価：
//   並寸・三寸詰 : 90,000円
//   伸寸         : 96,000円
//   四寸伸       : 112,000円
//
// 合計 = 単価 × 本数
// ─────────────────────────────────────────────
(function initOrderForm() {
  var strengthSelect = document.getElementById('bowStrength');
  var quantitySelect = document.getElementById('quantity');
  var hint           = document.getElementById('strengthHint');
  var totalEl        = document.getElementById('totalAmt');
  var quantityError  = document.getElementById('quantityError');
  var radios         = document.querySelectorAll('input[name="bowSun"]');

  if (!strengthSelect || !radios.length) return;

  var RANGES = {
    '並寸':   { min: 8,  max: 20 },
    '伸寸':   { min: 11, max: 20 },
    '四寸伸': { min: 11, max: 20 },
    '三寸詰': { min: 8,  max: 18 },
  };

  var HINTS = {
    '並寸':   '並寸：8〜20kg',
    '伸寸':   '伸寸：11〜20kg',
    '四寸伸': '四寸伸：11〜20kg',
    '三寸詰': '三寸詰：8〜18kg',
  };

  var UNIT_PRICE = {
    '並寸':   90000,
    '伸寸':   96000,
    '四寸伸': 112000,
    '三寸詰': 90000,
  };

  function getSelectedSun() {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return '並寸';
  }

  function buildStrengthSelect(sun) {
    var range = RANGES[sun];
    if (!range) return;

    strengthSelect.innerHTML = '';

    var ph = document.createElement('option');
    ph.value = '';
    ph.textContent = '選択してください';
    ph.disabled = true;
    ph.selected = true;
    strengthSelect.appendChild(ph);

    for (var kg = range.min; kg <= range.max; kg++) {
      var opt = document.createElement('option');
      opt.value = String(kg);
      opt.textContent = kg + ' kg';
      strengthSelect.appendChild(opt);
    }

    if (hint) hint.textContent = HINTS[sun] || '';
    updateTotal();
  }

  function updateTotal() {
    if (!totalEl) return;
    var sun       = getSelectedSun();
    var unitPrice = UNIT_PRICE[sun] || 90000;
    var qty       = quantitySelect ? parseInt(quantitySelect.value, 10) || 1 : 1;
    totalEl.textContent = (unitPrice * qty).toLocaleString('ja-JP');
  }

  function validateQuantity() {
    if (!quantitySelect || !quantityError) return true;
    var qty = parseInt(quantitySelect.value, 10);
    if (qty > 2) {
      quantityError.style.display = 'block';
      return false;
    }
    quantityError.style.display = 'none';
    return true;
  }

  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      buildStrengthSelect(this.value);
    });
  });

  strengthSelect.addEventListener('change', updateTotal);

  if (quantitySelect) {
    quantitySelect.addEventListener('change', function () {
      validateQuantity();
      updateTotal();
    });
  }

  // 初期化（ページ読み込み時に即実行）
  buildStrengthSelect(getSelectedSun());

  // 送信ボタン
  var submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', function () {
    var name     = document.getElementById('fname');
    var email    = document.getElementById('email');
    var strength = document.getElementById('bowStrength');
    var errors   = [];

    if (!name  || !name.value.trim())  errors.push('名前');
    if (!email || !email.value.trim()) errors.push('メールアドレス');
    if (!strength || !strength.value)  errors.push('弓の強さ');
    if (!validateQuantity())           errors.push('注文本数（最大2張）');

    if (errors.length) {
      alert('以下の項目を確認してください：\n' + errors.join('、'));
      return;
    }

    alert('ご相談・ご予約を承りました。\n弓師より数日内にご連絡差し上げます。\n\nありがとうございました。');
  });
}());