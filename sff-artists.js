/* ============================================================
   SFF Artist Profile – CSV fetch, ASCII-only (v7, 2025-07-01)
   ============================================================ */
(function () {
  /* ----------  Sheet settings ---------- */
  const SHEET_ID   = '17NWurBNv3Fu53afNlC-d4xsc37w_LDIuHmk-uhoPTsg';
  const SHEET_NAME = 'Artist Mastersheet - Live';   // plain hyphen, no en-dash
  const CSV_URL =
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID +
    '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(SHEET_NAME);

  const TARGET_ID = 'sff-artist-profile';

  /* ----------  Link labels ---------- */
  const LINKS = [
    ['website',   'Website'  ],
    ['instagram', 'Instagram'],
    ['facebook',  'Facebook' ],
    ['twitter',   'Twitter'  ],
    ['spotify',   'Spotify'  ],
    ['youtube',   'YouTube'  ]
  ];

  /* ----------  Helpers ---------- */
  const sanitize = (html = '') =>
    html.replace(/<\\/?\\s*(script|style|iframe|object|embed|link)[^>]*?>/gi, '');

  /* Basic CSV → rows. Your sheet has no embedded commas */
  const csvRows = csv => csv.trim().split(/\\r?\\n/).map(l => l.split(','));

  /* Build one card’s HTML */
  const renderCard = a => {
    const img = (a.image && a.image !== 'null')
      ? a.image
      : 'https://via.placeholder.com/400?text=Artist';

    const links = LINKS.filter(([k]) => a[k] && a[k] !== 'null')
      .map(([k, label]) =>
        '<a href="' + a[k] + '" target="_blank" rel="noopener">' + label + '</a>')
      .join('');

    return (
      '<article class="sff-card">' +
        '<h3 class="sff-name">' + (a.name || 'Unknown Artist') + '</h3>' +
        '<div class="sff-img"><img src="' + img +
        '" alt="' + (a.name || 'Artist') + ' profile" loading="lazy"></div>' +
        '<p class="sff-bio">' + sanitize(a.profile) + '</p>' +
        '<div class="sff-links">' + links + '</div>' +
      '</article>'
    );
  };

  /* ----------  Main ---------- */
  async function loadArtists () {
    const el = document.getElementById(TARGET_ID);
    if (!el) return;

    try {
      const csv = await fetch(CSV_URL).then(r => r.text());
      const rows = csvRows(csv);
      const heads = rows.shift().map(h => h.toLowerCase().trim());

      const list = rows.map(r => {
        const obj = {};
        heads.forEach((h, i) => { obj[h] = r[i] || ''; });
        return obj;
      }).sort((a, b) => (+a.order || 0) - (+b.order || 0));

      el.innerHTML = list.map(renderCard).join('');
    } catch (err) {
      console.error('SFF artist fetch error', err);
      el.textContent = 'Could not load artist profiles.';
    }
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadArtists);
  } else {
    loadArtists();
  }
})();
