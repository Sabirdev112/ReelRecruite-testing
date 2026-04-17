import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateWork', () => {
  test('UpdateWork', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateWork');
  });
});
