import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

import { LoginPage } from '../Pages/LoginPage.js';


const VALID_RECRUITER_EMAIL = 'carlos@gmail.com';
const VALID_RECRUITER_PASSWORD = 'Carlos@123';
const BASE_URL = 'https://recruitai-web-production.up.railway.app';
const TEST_DATA_FILE = path.join(process.cwd(), 'auth_testCases.json');


test('Recruiter Authentication Test Suite', async ({ page }) => {
    
    
    let totalTestsExecuted = 0;
    let failedTests = []; 
    
   
    const data = await fs.readFile(TEST_DATA_FILE, 'utf-8');
    const allTestCases = JSON.parse(data);
    const recruiterLoginTests = allTestCases.filter(tc => tc.group === 'Recruiter Login');
    
    const loginPage = new LoginPage(page);

    
    for (const testCase of recruiterLoginTests) {
        totalTestsExecuted++;
        console.log(`\n--- Executing Test ${totalTestsExecuted}: [${testCase.test_id}] - ${testCase.description} ---`);

        try {
            await loginPage.goto(); 
            if (testCase.test_id === 'AUTH_LOGIN_001') {
               
                await loginPage.login(VALID_RECRUITER_EMAIL, VALID_RECRUITER_PASSWORD);
                await expect(page).toHaveURL(`${BASE_URL}/my-jobs`); 
                
            } else if (testCase.test_id === 'AUTH_LOGIN_002') {
                await loginPage.login('wrong@email.com', 'wrong@password123');
                await expect(page.locator('.error-message-selector')).toBeVisible();
                await expect(page.locator('.error-message-selector')).toContainText(/error/i);
                
            } else if (testCase.test_id === 'AUTH_LOGIN_003') {
                await loginPage.clickSignIn.click();
                await expect(loginPage.usernameInput).toHaveAttribute('aria-invalid', 'true');
                await expect(page.locator('.validation-text')).toContainText('required');

            }
            
            else {
                console.warn(`[${testCase.test_id}] - Logic not implemented. Skipping actual test run.`);
                totalTestsExecuted--;
            }

            console.log(`[${testCase.test_id}] PASSED.`);
            
        } catch (error) {

            console.error(`[${testCase.test_id}] FAILED! Error: ${error.message}`);
            failedTests.push({
                id: testCase.test_id,
                description: testCase.description,
                error: error.message.split('\n')[0] 
            });

            await page.goto('about:blank'); 
        }
    }
    console.log('\n======================================');
    console.log('         TEST SUITE SUMMARY           ');
    console.log('======================================');
    console.log(`Total Scenarios Executed: ${totalTestsExecuted}`);
    
    if (failedTests.length > 0) {
        console.log(`Total Tests Failed: ${failedTests.length}`);
        console.log('\n--- Failed Test Details ---');
        failedTests.forEach(fail => {
            console.log(`ID: ${fail.id}`);
            console.log(`Description: ${fail.description}`);
            console.log(`Error Summary: ${fail.error}\n`);
        });
        
        await expect(failedTests.length).toBe(0);
        
    } else {
        console.log('✅ All tests passed successfully!');
    }
    console.log('======================================');
});