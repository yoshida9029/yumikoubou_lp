/* =============================================
   清響 弓工房 — main.js
   ============================================= */

'use strict';

// ─────────────────────────────────────────────
// ハンバーガーメニュー
// ─────────────────────────────────────────────
(function initHamburger() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
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
// 予約フォーム — 弓の強さプルダウン
//
//  並寸   : 8〜20 kg （1kg刻み）
//  伸寸   : 11〜20 kg
//  四寸伸 : 11〜20 kg
//  二寸伸 : 8〜20 kg
// ─────────────────────────────────────────────
(function initOrderForm() {
  var select  = document.getElementById('bowStrength');
  var hint    = document.getElementById('strengthHint');
  var radios  = document.querySelectorAll('input[name="bowSun"]');
  var totalEl = document.getElementById('totalAmt');

  if (!select || !radios.length) return;

  // 寸ごとの弓力レンジ
  var RANGES = {
    '並寸':   { min: 8,  max: 20 },
    '伸寸':   { min: 11, max: 20 },
    '四寸伸': { min: 11, max: 20 },
    '二寸伸': { min: 8,  max: 20 },
  };

  // 寸ごとのヒントテキスト
  var HINTS = {
    '並寸':   '並寸：8〜20kg',
    '伸寸':   '伸寸：11〜20kg',
    '四寸伸': '四寸伸：11〜20kg',
    '二寸伸': '二寸伸：8〜20kg',
  };

  // 参考価格（基本）
  var BASE_PRICE = {
    '並寸':   680000,
    '伸寸':   800000,
    '四寸伸': 1000000,
    '二寸伸': 680000,
  };

  /* 選択中の寸を取得 */
  function getSelectedSun() {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return '並寸';
  }

  /* プルダウンを再生成 */
  function buildSelect(sun) {
    var range = RANGES[sun];
    select.innerHTML = '';

    // 先頭に選択促し
    var ph = document.createElement('option');
    ph.value = '';
    ph.textContent = '選択してください';
    ph.disabled = true;
    ph.selected = true;
    select.appendChild(ph);

    for (var kg = range.min; kg <= range.max; kg++) {
      var opt = document.createElement('option');
      opt.value = String(kg);
      opt.textContent = kg + ' kg';
      select.appendChild(opt);
    }

    if (hint) hint.textContent = HINTS[sun] || '';
    updateTotal();
  }

  /* 合計金額を更新 */
  function updateTotal() {
    if (!totalEl) return;
    var sun = getSelectedSun();
    var kg  = parseInt(select.value, 10);

    if (!kg) {
      totalEl.textContent = '—';
      return;
    }

    var base  = BASE_PRICE[sun] || 680000;
    var extra = (kg - RANGES[sun].min) * 20000;
    var total = base + extra;
    totalEl.textContent = total.toLocaleString('ja-JP');
  }

  /* ラジオ変更時 */
  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      buildSelect(this.value);
    });
  });

  /* プルダウン変更時 */
  select.addEventListener('change', updateTotal);

  /* 初期化 */
  buildSelect(getSelectedSun());

  // ─────────────────────────────────────────
  // 送信ボタン
  // ─────────────────────────────────────────
  var submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', function () {
    var name     = document.getElementById('fname');
    var email    = document.getElementById('email');
    var strength = document.getElementById('bowStrength');
    var errors   = [];

    if (!name  || !name.value.trim())     errors.push('名前');
    if (!email || !email.value.trim())    errors.push('メールアドレス');
    if (!strength || !strength.value)     errors.push('弓の強さ');

    if (errors.length) {
      alert('以下の項目を入力・選択してください：\n' + errors.join('、'));
      return;
    }

    alert('ご相談・ご予約を承りました。\n弓師より数日内にご連絡差し上げます。\n\nありがとうございました。');
  });
}());

// ─────────────────────────────────────────────
// スクロールフェードイン
// ─────────────────────────────────────────────
(function initFadeIn() {
  var targets = document.querySelectorAll(
    '.about-item, .spec-row, .intro-note, .workshop-text-col, ' +
    '.order-text, .order-notice, .order-sub-note'
  );
  if (!targets.length || !('IntersectionObserver' in window)) return;

  targets.forEach(function (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) { io.observe(el); });
}());
