export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Safety net: kalau ini request ke file asli (css/js/gambar/dll), jangan diganggu
  if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
    return context.next();
  }

  const assetUrl = new URL('/artikel-detail', url.origin);
  return env.ASSETS.fetch(assetUrl.toString());
}
