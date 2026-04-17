import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: CreateJob', () => {
  test('CreateJob', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'CreateJob', {
    });
  });
});
