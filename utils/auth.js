export async function loginCandidate(request, user) {
  const res = await request.post(
    'https://recruitai-backend-production.up.railway.app/v1/auth/signin',
    { data: user }
  );

  const data = await res.json();
  if (data.code !== 1000) {
    throw new Error(`Login failed for ${user.email}`);
  }

  return data.tokens.access_token;
}
