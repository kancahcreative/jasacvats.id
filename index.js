export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Route statis -> index.html (biar SPA-style anchor/section jalan)
    const staticRoutes = new Set([
      '/', '/beranda', '/tentang-kami', '/detail-paket', '/paket-harga', '/faq'
    ]);
    if (staticRoutes.has(pathname)) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }

    // Halaman daftar artikel
    if (pathname === '/artikel') {
      return env.ASSETS.fetch(new Request(new URL('/artikel.html', url), request));
    }

    // File statis asli (css, js, gambar, admin.html, favicon, dst) -> serve apa adanya
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // Sisanya dianggap slug artikel -> artikel-detail.html
    return env.ASSETS.fetch(new Request(new URL('/artikel-detail.html', url), request));
  }
};
