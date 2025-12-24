export function pickDisplayName(info) {
  const hostname = (info.hostname || '').replace(/^www\./, '').toLowerCase();
  const brand = hostname.split('.')[0]; // first label of hostname

  // 1. Explicit site_name meta
  if (info.site_name) return info.site_name.trim();
  // 2. Author meta (sometimes brand for blogs)
  if (info.author) return info.author.trim();

  // 3. Title brand extraction
  if (info.title) {
    // Strip notification counts like (4)
    let t = info.title.replace(/^\(\d+\)\s*/, '').trim();
    // Split on common separators
    const parts = t.split(/\s*[\|\-–—]\s*/).filter(Boolean);
    if (parts.length > 1) {
      // Prefer a part containing the brand token
      const brandPart = parts.find(p => {
        const pl = p.toLowerCase();
        return pl.includes(brand) || brand.includes(pl);
      });
      if (brandPart) return brandPart.trim();
      // Generic words we should avoid choosing as display name if a later part looks like a brand
      const GENERIC = new Set(['feed','home','dashboard','profile','login','sign in','sign up']);
      // Heuristic: if last part is short and capitalized (brand-style), use last
      const last = parts[parts.length - 1];
      const lastIsBrandy = /[A-Z]/.test(last) && last.length <= 30;
      if (lastIsBrandy && !GENERIC.has(last.toLowerCase())) return last.trim();
      // Otherwise choose first non-generic
      const nonGeneric = parts.find(p => !GENERIC.has(p.toLowerCase())) || parts[0];
      return nonGeneric.trim();
    }
    return t;
  }

  // 4. Fallback to hostname brand
  if (brand) return brand;
  if (hostname) return hostname;
  return 'Extension Panel';
}
