/* ============================================================
   SFF Artist Profile – CSV fetch, all ASCII (v9)
   ============================================================ */
(function () {
  /* ----------  CONFIG  ---------- */
  const SHEET_ID   = '17NWurBNv3Fu53afNlC-d4xsc37w_LDIuHmk-uhoPTsg';

  /* Sheet tab name with en-dash safely escaped */
  const SHEET_NAME = 'Artist Mastersheet \u2013 Live';

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
  const sanitize = (html = '') =>
    html.replace(/<\\/?\\s*(script|style|iframe|object|embed|link)[^>]*?>/gi, '');

  const csvRows = csv => csv.trim().split(/\\r?\\n/).map(l => l.split(','));

  const buildLinks = a =>
    LINKS.filter(([k]) => a[k] && a[k] !== 'null')
         .map(([k, label]) =>
           '<a href="' + a[k] + '" target="_blank" rel="noopener">' + label + '</a>')
         .join('');

  const buildCard = a => {
    const imgSrc = (a.image && a.image !== 'null')
      ? a.image
      : 'https://via.placeholder.com/400?text=Artist';

    return (
      '<article class="sff-card">' +
        '<h3 class="sff-name">' + (a.name || 'Unknown Artist') + '</h3>' +
        '<div class="sff-img"><img src="' + imgSrc +
        '" alt="' + (a.name || 'Artist') + ' profile" loading="lazy"></div>' +
        '<p class="sff-bio">' + sanitize(a.profile) + '</p>' +
        '<div class="sff-links">' + buildLinks(a) + '</div>' +
      '</article>'
    );
  };

  /* ----------  Main ---------- */
  async function init () {
    const container = document.getElementById(TARGET_ID);
    if (!container) return;

    try {
      const csv  = await fetch(CSV_URL).then(r => r.text());
      const rows = csvRows(csv);
      const heads = rows.shift().map(h => h.toLowerCase().trim());

      const list = rows.map(r => {
        const o = {};
        heads.forEach((h, i) => { o[h] = r[i] || ''; });
        return o;
      }).sort((a, b) => (+a.order || 0) - (+b.order || 0));

      container.innerHTML = list.map(buildCard).join('');
    } catch (err) {
      console.error('SFF artist fetch error', err);
      container.textContent = 'Could not load artist profiles.';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
