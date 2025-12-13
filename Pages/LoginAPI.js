// Pages/AuthApi.js
export class AuthApi {
  constructor(page, request) {
    this.page = page;
    this.request = request;
    this.baseUrl = 'https://recruitai-web-production.up.railway.app';
  }

  async loginAndRedirect(email, password) {
    const response = await this.request.post(
      'https://recruitai-backend-production.up.railway.app/v1/auth/signin',
      {
        data: { email, password }
      }
    );

    if (!response.ok()) {
      throw new Error(`Login failed: ${await response.text()}`);
    }

    const data = await response.json();

    const token = data.tokens?.access_token;
    const userId = data.user?.id;

    if (!token || !userId) {
      throw new Error('Token or userId missing from login response');
    }

    // Inject auth before any page JS runs
    await this.page.addInitScript(({ token }) => {
      localStorage.setItem('access_token', token);
    }, { token });

    // Navigate directly to profile with backend ID
    await this.page.goto(`${this.baseUrl}/profile/${userId}`, {
      waitUntil: 'networkidle'
    });

    return { token, userId };
  }
}
