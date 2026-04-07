import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: ArchiveChat', () => {
  test('ArchiveChat', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'ArchiveChat');
  });
});
