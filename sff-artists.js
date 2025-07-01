/* ============================================================
   SFF Artist Profile  –  CSV fetch (ASCII-only, 2025-07-01)
   ============================================================ */
(function () {
  /* ----------  CONFIG  ---------- */
  const SHEET_ID   = '17NWurBNv3Fu53afNlC-d4xsc37w_LDIuHmk-uhoPTsg';
  const SHEET_NAME = 'Artist Mastersheet - Live'; // plain hyphen
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

  /* ----------  Helpers  ---------- */
  const sanitize = (str = '') =>
    str.replace(/<\\/?\\s*(script|style|iframe|object|embed|link)[^>]*?>/gi, '');

  /* Trivial CSV -> rows (commas not in cell values) */
  const csvToRows = csv =>
    csv.trim().split(/\\r?\\n/).map(line => line.split(','));

  const buildCard = a => {
    const linksHtml = LINKS
      .filter(([k]) => a[k])
      .map(([k, label]) =>
        '<a href="' + a[k] + '" target="_blank" rel="noopener">' + label + '</a>')
      .join('');

    return (
      '<article class="sff-card">' +
        '<h3 class="sff-name">' + (a.name || 'Unknown Artist') + '</h3>' +
        '<div class="sff-img">' +
          '<img src="' + (a.image || 'https://via.placeholder.com/400?text=Artist') +
          '" alt="' + (a.name || 'Artist') + ' profile" loading="lazy">' +
        '</div>' +
        '<p class="sff-bio">' + sanitize(a.profile) + '</p>' +
        '<div class="sff-links">' + linksHtml + '</div>' +
      '</article>'
    );
  };

  /* ----------  Main ---------- */
  async function init () {
    const container = document.getElementById(TARGET_ID);
    if (!container) return;

    try {
      const text = await fetch(CSV_URL).then(r => r.text());
      const rows = csvToRows(text);
      const heads = rows.shift().map(h => h.toLowerCase().trim());

      const list = rows.map(r => {
        const obj = {};
        heads.forEach((h, i) => { obj[h] = r[i] || ''; });
        return obj;
      }).sort((a, b) => (+a.order || 0) - (+b.order || 0));

      container.innerHTML = list.map(buildCard).join('');
    } catch (err) {
      console.error('SFF artist fetch error', err);
      container.textContent = 'Could not load artist profiles.';
    }
  }

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
