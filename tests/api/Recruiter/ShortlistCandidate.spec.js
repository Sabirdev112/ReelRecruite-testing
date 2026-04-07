import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: ShortlistCandidate', () => {
  test('ShortlistCandidate', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'ShortlistCandidate');
  });
});
