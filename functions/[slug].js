export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Route section di homepage (dulu ditangani _redirects -> /index.html).
  // PENTING: _redirects TIDAK jalan untuk path yang sudah ketangkep Function ini,
  // walaupun kita context.next(). Jadi index.html-nya harus di-fetch langsung di sini.
  const homeSectionRoutes = new Set([
    '/beranda', '/tentang-kami', '/detail-paket', '/paket-harga', '/faq'
  ]);
  if (homeSectionRoutes.has(pathname)) {
    return env.ASSETS.fetch(new URL('/', url.origin).toString());
  }

  // Route yang emang punya file statis sendiri -> biarkan lewat normal
  const knownStaticRoutes = new Set(['/', '/artikel', '/admin']);
  if (knownStaticRoutes.has(pathname) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return context.next();
  }

  // Sisanya baru dianggap slug artikel
  const assetUrl = new URL('/artikel-detail', url.origin);
  return env.ASSETS.fetch(assetUrl.toString());
}
