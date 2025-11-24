import fs from 'fs';
import { test } from '@playwright/test';
import { SendMessagePage } from '../Pages/SendMessagePage.js';
import { LoginPage } from '../Pages/LoginPage.js';

function getRandomMessage() {
    const data = fs.readFileSync('random_messages.csv', 'utf8');
    const lines = data.split('\n').slice(1); // skip header
    const cleaned = lines.filter(l => l.trim().length > 0);
    return cleaned[Math.floor(Math.random() * cleaned.length)];
}

test('Candidate logs in and sends a message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sendMessagePage = new SendMessagePage(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login('carlos@gmail.com', 'Carlos@123');

    // Step 2: Messaging actions
    await sendMessagePage.openMessages();
    await sendMessagePage.selectMessage();

    const message = getRandomMessage();
    await sendMessagePage.sendMessage(message);
});
