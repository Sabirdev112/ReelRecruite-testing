import { ENV } from './env.js';

export async function apiLogin(request, email, password) {
  const response = await request.post(
    `${ENV.API_BASE_URL}/v1/auth/signin`,
    { data: { email, password } }
  );

  if (!response.ok()) {
    throw new Error(`Login failed for ${email}`);
  }

  const data = await response.json();

  return {
    token: data.tokens.access_token,
    userId: data.user.id,
    role: data.user.role,
    fullName: data.user.fullName
  };
}
