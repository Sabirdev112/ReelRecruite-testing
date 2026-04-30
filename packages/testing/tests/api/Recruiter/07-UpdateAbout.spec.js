import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateAbout', () => {
  test('UpdateAbout', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateAbout');
  });
});
