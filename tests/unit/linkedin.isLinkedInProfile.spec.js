// TDD: Failing tests for LinkedIn profile detection
// Expected API: export function isLinkedInProfile(url, doc)
// Implement in a future module at repo root: 'linkedinDetection.js'

import { isLinkedInProfile } from '../../linkedinDetection.js';

describe('isLinkedInProfile', () => {
  beforeEach(() => {
    // Reset DOM between tests
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  const profileUrls = [
    'https://www.linkedin.com/in/jane-doe',
    'https://www.linkedin.com/in/jane-doe/',
    'https://www.linkedin.com/in/jane-doe?trk=public_profile',
    'http://linkedin.com/in/jane-doe#about',
    'https://uk.linkedin.com/in/jane-doe',
  ];

  test.each(profileUrls)('returns true for LinkedIn profile URL: %s', (url) => {
    expect(isLinkedInProfile(url, typeof document !== 'undefined' ? document : null)).toBe(true);
  });

  const nonProfileUrls = [
    'https://www.linkedin.com/feed/',
    'https://www.linkedin.com/jobs/',
    'https://www.linkedin.com/company/acme',
    'https://example.com/in/jane-doe',
    'https://www.linkedin.com/',
    'https://www.linkedin.com/sales',
  ];

  test.each(nonProfileUrls)('returns false for non-profile URL: %s', (url) => {
    expect(isLinkedInProfile(url, typeof document !== 'undefined' ? document : null)).toBe(false);
  });

  test('returns false for ambiguous LinkedIn URLs without /in/ prefix', () => {
    document.body.innerHTML = '';
    expect(isLinkedInProfile('https://www.linkedin.com/some/unknown', document)).toBe(false);
  });

  test('handles null document gracefully', () => {
    expect(isLinkedInProfile('https://www.linkedin.com/in/jane-doe', null)).toBe(true);
    expect(isLinkedInProfile('https://www.linkedin.com/feed', null)).toBe(false);
  });
});
