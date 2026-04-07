import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateSkill', () => {
  test('UpdateSkill', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateSkill');
  });
});
