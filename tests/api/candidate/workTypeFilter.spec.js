import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: workTypeFilter', () => {
  test('workTypeFilter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'workTypeFilter');
  });
});
