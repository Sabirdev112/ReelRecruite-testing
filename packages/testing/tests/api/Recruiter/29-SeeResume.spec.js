import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: SeeResume', () => {
  test('SeeResume', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'SeeResume');
  });
});
