import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateEducation', () => {
  test('UpdateEducation', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateEducation');
  });
});
