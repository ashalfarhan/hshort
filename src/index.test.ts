import app from './';
import { expect, describe, it, vi } from 'vitest';

// vi.mock('__STATIC_CONTENT_MANIFEST', () => ({}));
// vi.stubGlobal('__STATIC_CONTENT_MANIFEST', 'vitest')

const KV_GET = vi.fn();
const KV_PUT = vi.fn();

const MOCK_ENV = {
  KEY_VAL: { get: KV_GET, put: KV_PUT },
};

describe('API Create URL', () => {
  describe('Negative', () => {
    it('should redirect to / and show error when request missing URL', async () => {
      const response = await app.request('/api/new', {
        method: 'POST',
        body: new FormData(),
      });
      expect(response.status).toBe(303);
      expect(response.headers.get('Location')).toMatch(/please enter url/i);
    });
    it('should redirect to / and show error when slug already used', async () => {
      KV_GET.mockResolvedValueOnce('https://mock.com/test');
      const form = new FormData();
      form.set('url', 'https://github.com/ashalfarhan');
      form.set('slug', 'used');
      const response = await app.request(
        '/api/new',
        {
          method: 'POST',
          body: form,
        },
        MOCK_ENV
      );
      expect(response.status).toBe(303);
      expect(response.headers.get('Location')).toMatch(/already used/i);
    });
    it('should redirect to / and show error when exception thrown while put KV', async () => {
      KV_PUT.mockRejectedValueOnce(new Error('Cannot found Namespace'));
      const form = new FormData();
      form.set('url', 'https://github.com/ashalfarhan');
      form.set('slug', 'used');
      const response = await app.request(
        '/api/new',
        {
          method: 'POST',
          body: form,
        },
        MOCK_ENV
      );
      expect(response.status).toBe(303);
      expect(response.headers.get('Location')).toMatch(
        /cannot found namespace/i
      );
    });
  });

  describe('Positive', () => {
    it('should redirect to /created and show shortened url', async () => {
      const form = new FormData();
      form.set('url', 'https://github.com/ashalfarhan');
      form.set('slug', 'test');
      const response = await app.request(
        '/api/new',
        {
          method: 'POST',
          body: form,
        },
        MOCK_ENV
      );
      expect(response.status).toBe(303);
      expect(response.headers.get('Location')).toBe('/created?slug=test');
    });
  });
});

describe('Resolve shortened URL', () => {
  describe('Negative', () => {
    it('should redirect to / and show error when slug cannot be found', async () => {
      KV_GET.mockResolvedValue(null);
      const response = await app.request('/test', {}, MOCK_ENV);
      expect(response.status).toBe(303);
      expect(response.headers.get('Location')).toMatch(/slug cannot be found/i);
    });
    it('should redirect to / and show error when exception thrown while get KV', async () => {
      KV_GET.mockRejectedValueOnce(new Error('Cannot found Namespace'));
      const response = await app.request('/test', {}, MOCK_ENV);
      expect(response.status).toBe(303);
      expect(response.headers.get('Location')).toMatch(
        /cannot found namespace/i
      );
    });
  });

  describe('Positive', () => {
    it('should redirect to the saved url when slug is found', async () => {
      KV_GET.mockResolvedValueOnce('https://github.com/ashalfarhan');
      const response = await app.request('/test', {}, MOCK_ENV);
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'https://github.com/ashalfarhan'
      );
    });
  });
});
