import { pickDisplayName } from '../../pickDisplayName.js';

describe('pickDisplayName', () => {
  describe('LinkedIn-style titles', () => {
    test('extracts brand from "(4) Feed | LinkedIn"', () => {
      const info = {
        title: '(4) Feed | LinkedIn',
        hostname: 'www.linkedin.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('LinkedIn');
    });

    test('extracts brand from "Feed | LinkedIn" without notification count', () => {
      const info = {
        title: 'Feed | LinkedIn',
        hostname: 'www.linkedin.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('LinkedIn');
    });

    test('extracts profile name from "John Doe | LinkedIn"', () => {
      const info = {
        title: 'John Doe | LinkedIn',
        hostname: 'www.linkedin.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('LinkedIn');
    });
  });

  describe('News/blog site titles', () => {
    test('extracts brand from "Article Title - The Verge"', () => {
      const info = {
        title: 'Article Title - The Verge',
        hostname: 'www.theverge.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('The Verge');
    });

    test('extracts brand from "Home | Example Site"', () => {
      const info = {
        title: 'Home | Example Site',
        hostname: 'example.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('Example Site');
    });
  });

  describe('Meta tag priority', () => {
    test('prefers site_name over title parsing', () => {
      const info = {
        title: '(4) Feed | LinkedIn',
        hostname: 'www.linkedin.com',
        author: '',
        site_name: 'LinkedIn Corporation'
      };
      expect(pickDisplayName(info)).toBe('LinkedIn Corporation');
    });

    test('prefers author over title when site_name absent', () => {
      const info = {
        title: 'Some Blog Post - Blog Name',
        hostname: 'blog.example.com',
        author: 'Jane Blogger',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('Jane Blogger');
    });
  });

  describe('Simple titles without separators', () => {
    test('returns title as-is when no separators found', () => {
      const info = {
        title: 'Google',
        hostname: 'www.google.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('Google');
    });

    test('strips notification count from simple title', () => {
      const info = {
        title: '(12) GitHub',
        hostname: 'github.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('GitHub');
    });
  });

  describe('Fallback behavior', () => {
    test('falls back to hostname brand when title is empty', () => {
      const info = {
        title: '',
        hostname: 'www.example.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('example');
    });

    test('returns "Extension Panel" when all fields empty', () => {
      const info = {
        title: '',
        hostname: '',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('Extension Panel');
    });
  });

  describe('Brand matching in title', () => {
    test('picks part containing hostname brand token', () => {
      const info = {
        title: 'Dashboard - GitHub Enterprise',
        hostname: 'github.com',
        author: '',
        site_name: ''
      };
      expect(pickDisplayName(info)).toBe('GitHub Enterprise');
    });
  });
});
