import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: ViewAppliedJobs', () => {
  test('ViewAppliedJobs', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'ViewAppliedJobs');
  });
});
