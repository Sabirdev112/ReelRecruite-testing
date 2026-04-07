import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateInfoRecruiter', () => {
  test('UpdateInfoRecruiter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateInfoRecruiter');
  });
});
