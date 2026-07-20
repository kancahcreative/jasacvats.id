export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Route ini cuma "alias" ke section di dalam index.html (bukan file HTML sendiri).
  // PENTING: _redirects TIDAK dipakai di sini karena request ini sudah ditangani
  // Functions, jadi harus di-serve manual di sini, bukan diserahkan ke context.next().
  const sectionRoutes = new Set([
    '/', '/beranda', '/tentang-kami', '/detail-paket', '/paket-harga', '/faq'
  ]);

  if (sectionRoutes.has(pathname)) {
    const assetUrl = new URL('/index.html', url.origin);
    return env.ASSETS.fetch(assetUrl.toString());
  }

  // Route yang memang punya file HTML sendiri -> biarkan lewat normal
  const ownPageRoutes = new Set(['/artikel', '/admin']);

  if (ownPageRoutes.has(pathname) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return context.next();
  }

  // Sisanya baru dianggap slug artikel
  const assetUrl = new URL('/artikel-detail', url.origin);
  return env.ASSETS.fetch(assetUrl.toString());
}
