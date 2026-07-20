// functions/sitemap.xml.js
// Menghasilkan sitemap.xml secara dinamis: halaman statis + semua artikel published di Supabase.
// Diakses di https://jasacvats.id/sitemap.xml

const SUPABASE_URL = "https://vvpxvfltzcujxgglguou.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-pk7cQ4qdpXtCXT_ypqKzA_WKIkPEBd";

const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/tentang-kami", priority: "0.7", changefreq: "monthly" },
  { path: "/paket-harga", priority: "0.9", changefreq: "weekly" },
  { path: "/detail-paket", priority: "0.6", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/artikel", priority: "0.8", changefreq: "daily" },
];

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function onRequest(context) {
  const origin = "https://jasacvats.id";
  const now = new Date().toISOString().split("T")[0];

  const staticEntries = STATIC_PATHS.map((p) =>
    urlEntry(`${origin}${p.path}`, now, p.changefreq, p.priority)
  );

  let articleEntries = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=slug,updated_at,created_at&published=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (res.ok) {
      const articles = await res.json();
      articleEntries = articles.map((a) => {
        const lastmod = (a.updated_at || a.created_at || now).split("T")[0];
        return urlEntry(`${origin}/${a.slug}`, lastmod, "monthly", "0.7");
      });
    }
  } catch (err) {
    // Kalau Supabase gagal diakses, sitemap tetap tampil dengan halaman statis saja.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticEntries,
    ...articleEntries,
  ].join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=UTF-8" },
  });
}
