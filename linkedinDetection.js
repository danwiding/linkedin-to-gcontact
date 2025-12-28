// Minimal stub for TDD: initial red tests should fail on assertions
export function isLinkedInProfile(url, doc) {

  // URL-based heuristic: linkedin domain + "/in/" path prefix
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isLinkedInHost = host === 'linkedin.com' || host.endsWith('.linkedin.com');
    const path = u.pathname; // includes leading '/'
    if (isLinkedInHost && path.startsWith('/in/')) return true;
    return false;
  } catch {
    // Fallback for non-URL strings
    if (typeof url === 'string') {
      const lower = url.toLowerCase();
      const hostLike = lower.includes('linkedin.com');
      const pathLike = lower.includes('/in/');
      return hostLike && pathLike;
    }
    return false;
  }
}
