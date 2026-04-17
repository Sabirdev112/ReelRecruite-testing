import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateAboutRecruiter', () => {
  test('UpdateAboutRecruiter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateAboutRecruiter');
  });
});
