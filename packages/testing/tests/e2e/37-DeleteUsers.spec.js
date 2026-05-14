import { test } from '../fixtures/base.fixtures.js';
import { deleteCandidate, deleteRecruiter } from '../utils/signupDb.helper.js';

test('Delete candidate created by signup', async () => {
  await deleteCandidate();
});

test('Delete recruiter created by signup', async () => {
  await deleteRecruiter();
});
