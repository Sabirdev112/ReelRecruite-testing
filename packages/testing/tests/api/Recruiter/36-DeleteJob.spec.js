import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: DeleteJob', () => {
  test('DeleteJob', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'DeleteJob');
  });
});
