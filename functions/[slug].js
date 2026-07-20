export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Route yang sudah ditangani _redirects atau file statis -> biarkan lewat normal
  const knownRoutes = new Set([
    '/', '/beranda', '/tentang-kami', '/detail-paket', '/paket-harga', '/faq', '/artikel', '/admin'
  ]);

  if (knownRoutes.has(pathname) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return context.next();
  }

  // Sisanya baru dianggap slug artikel
  const assetUrl = new URL('/artikel-detail', url.origin);
  return env.ASSETS.fetch(assetUrl.toString());
}
