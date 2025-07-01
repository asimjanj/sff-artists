/* ============================================================
   SFF Artist Profile – CSV fetch (no CSP issues)
   ============================================================ */
(function () {
  /* ---- CONFIG ---- */
  const SHEET_ID   = '17NWurBNv3Fu53afNlC-d4xsc37w_LDIuHmk-uhoPTsg';
  const SHEET_NAME = 'Artist Mastersheet - Live';          // plain hyphen
  const CSV_URL =
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID +
    '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(SHEET_NAME);

  const TARGET_ID = 'sff-artist-profile';

  const LINKS = [
    ['website',   'Website'  ],
    ['instagram', 'Instagram'],
    ['facebook',  'Facebook' ],
    ['twitter',   'Twitter'  ],
    ['spotify',   'Spotify'  ],
    ['youtube',   'YouTube'  ]
  ];

  const sanitize = (html = '') =>
    html.replace(/<\\/?\\s*(script|style|iframe|object|embed|link)[^>]*?>/gi, '');

  /* ---- tiny CSV parser (commas not allowed inside cells) ---- */
  const csvToRows = csv =>
    csv.trim().split(/\\r?\\n/).map(line => line.split(','));

  /* ---- fetch & render ---- */
  async function init () {
    const target = document.getElementById(TARGET_ID);
    if (!target) return;

    try {
      const text = await fetch(CSV_URL).then(r => r.text());
      const rows = csvToRows(text);
      const heads = rows.shift().map(h => h.toLowerCase().trim());
      const list  = rows.map(r => {
        const o = {};
        heads.forEach((h,i) => { o[h] = r[i] || ''; });
        return o;
      }).sort((a,b) => (+a.order || 0) - (+b.order || 0));

      target.innerHTML = list.map(a => `
        <article class="sff-card">
          <h3 class="sff-name">${a.name || 'Unknown Artist'}</h3>
          <div class="sff-img">
            <img src="${a.image || 'https://via.placeholder.com/400?text=Artist'}"
                 alt="${a.name || 'Artist'} profile" loading="lazy">
          </div>
          <p class="sff-bio">${sanitize(a.profile)}</p>
          <div class="sff-links">
            ${LINKS.filter(([k]) => a[k])
                    .map(([k,l]) => `<a href="${a[k]}" target="_blank" rel="noopener">${l}</a>`)
                    .join('')}
          </div>
        </article>`).join('');
    } catch (err) {
      console.error('Artist fetch error', err);
      target.textContent = 'Could not load artist profiles.';
    }
  }

  /* run when DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
