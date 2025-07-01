/* ============================================================
   SFF Artist Profile  –  Dynamic Gallery
   ------------------------------------------------------------
   Paste this file on GitHub, e.g.:
   https://cdn.jsdelivr.net/gh/your-user/sff-widgets@main/artists-profile.js
   Then embed in Raisely page:

     <div id="sff-artist-profile">Loading artists…</div>
     <script src="https://cdn.jsdelivr.net/gh/your-user/sff-widgets@main/artists-profile.js"></script>
=========================================================== */

(function () {
  /* ----------  CONFIG  ---------- */
  const SHEET_ID   = '17NWurBNv3Fu53afNlC-d4xsc37w_LDIuHmk-uhoPTsg';
  const SHEET_NAME = 'Artist Mastersheet – Live';

  const JSONP_URL =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
    `/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}` +
    `&tqx=out:json&callback=renderSFFArtistProfile`;

  const LINKS = [
    ['website',   'Website'  ],
    ['instagram', 'Instagram'],
    ['facebook',  'Facebook' ],
    ['twitter',   'Twitter'  ],
    ['spotify',   'Spotify'  ],
    ['youtube',   'YouTube'  ],
  ];

  const sanitize = (html = '') =>
    html.replace(/<\\/?\\s*(script|style|iframe|object|embed|link)[^>]*?>/gi, '');

  /* ----------  JSONP callback (must be global) ---------- */
  window.renderSFFArtistProfile = function (json) {
    const target = document.getElementById('sff-artist-profile');
    if (!target) return;

    const heads = json.table.cols.map(c => c.label.toLowerCase().trim());
    const rows  = json.table.rows.map(r => {
      const o={};
      r.c.forEach((c,i)=> o[heads[i]] = c ? c.v : '');
      return o;
    }).sort((a,b)=>(a.order||0)-(b.order||0));

    target.innerHTML = rows.map(a => `
      <article class="sff-card">
        <h3 class="sff-name">${a.name || 'Unknown Artist'}</h3>
        <div class="sff-img">
          <img src="${a.image || 'https://via.placeholder.com/400?text=Artist'}"
               alt="${a.name || 'Artist'} profile image" loading="lazy">
        </div>
        <p class="sff-bio">${sanitize(a.profile || '')}</p>
        <div class="sff-links">
          ${LINKS.filter(([k]) => a[k])
                  .map(([k,l]) => `<a href="${a[k]}" target="_blank" rel="noopener">${l}</a>`)
                  .join('')}
        </div>
      </article>
    `).join('');
  };

  /* ----------  Inject JSONP <script> ---------- */
  const s = document.createElement('script');
  s.src = JSONP_URL;
  s.onerror = () => {
    const t = document.getElementById('sff-artist-profile');
    if (t) t.textContent = 'Could not load artist profiles.';
  };
  document.body.appendChild(s);
})();