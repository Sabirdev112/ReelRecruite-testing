import { test } from '@playwright/test';
import fs from 'fs';

const messages = JSON.parse(fs.readFileSync('randomMessages.json', 'utf-8'));

// User credentials
const USER = {
  email: 'carlos@gmail.com',
  password: 'Carlos@1233'
};

// Chat ID where messages should be sent
const CHAT_ID = '5ebf38d4-6aed-4b5e-b68b-4067040e03e7';

// Function to get a random message from the JSON
function getRandomMessage() {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

test('Sign in and send random message', async ({ request }) => {
  console.log(`Signing in: ${USER.email}`);

  // 1️⃣ Sign in
  const loginResp = await request.post(
    'https://recruitai-backend-production.up.railway.app/v1/auth/signin',
    { data: { email: USER.email, password: USER.password } }
  );

  if (!loginResp.ok()) {
    console.error(`Login failed:`, await loginResp.text());
    return;
  }

  const loginData = await loginResp.json();
  const token = loginData.tokens?.access_token;

  if (!token) {
    console.error(`Login did not return a token`);
    return;
  }

  console.log(`Login successful | token: ${token.slice(0, 10)}...`);

  // 2️⃣ Pick a random message
  const messageContent = getRandomMessage();

  // 3️⃣ Send message
  const sendResp = await request.post(
    'https://recruitai-backend-production.up.railway.app/v1/messages/create/send',
    {
      data: { chatId: CHAT_ID, content: messageContent },
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!sendResp.ok()) {
    console.error(`Failed to send message:`, await sendResp.text());
    return;
  }

  console.log(`Message sent successfully: "${messageContent}"`);
});
