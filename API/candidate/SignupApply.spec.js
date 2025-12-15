import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load users
const users = JSON.parse(fs.readFileSync('../../fixtures/users/Candidate.json', 'utf-8'));
const JOB_ID = 'b36c2275-eb87-422a-b7e8-821e7f3fa4cf';

// --------- VIDEO LOADING FIX ---------
// Use project root 'videos' folder
const videoDir = path.join(process.cwd(), 'videos');

// Ensure folder exists
if (!fs.existsSync(videoDir)) {
  throw new Error(`Videos folder not found at ${videoDir}. Create a "videos" folder in project root and add video files.`);
}

// Read and filter files by extension (robust, case-insensitive)
const videoFiles = fs.readdirSync(videoDir)
  .filter(file => /\.(mp4|mov|mkv)$/i.test(file))
  .map(file => path.join(videoDir, file));

if (videoFiles.length === 0) {
  throw new Error(`No video files found in ${videoDir}. Supported extensions: .mp4, .mov, .mkv`);
}

let videoIndex = 0;

function getNextVideoPath() {
  const filePath = videoFiles[videoIndex % videoFiles.length];
  videoIndex++;
  return filePath;
}
// --------- END VIDEO LOADING FIX ---------

test('Sign up, verify and apply job for 50 users', async ({ request }) => {
  for (const user of users) {
    console.log(`\nProcessing: ${user.email}`);

    // Assign one video per user (local file path)
    const selectedVideoPath = getNextVideoPath();
    console.log(`Assigned video file: ${selectedVideoPath}`);

    // Convert the local video file to base64 data URL (keeps payload structure same as prior change)
    const videoBuffer = fs.readFileSync(selectedVideoPath);
    const videoBase64 = videoBuffer.toString('base64');
    const VIDEO_URL = `data:video/mp4;base64,${videoBase64}`;

    // 1️⃣ Sign up
    const signupResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/auth/signup',
      {
        data: {
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          userType: 'candidate'
        }
      }
    );

    if (!signupResp.ok()) {
      const errorBody = await signupResp.text();
      console.error(`Signup failed for ${user.email}:`, errorBody);
      continue;
    }

    const signupData = await signupResp.json();
    const signupUserId = signupData.user?.id;

    if (!signupUserId) {
      console.error(`Cannot find userId in signup response for ${user.email}`);
      continue;
    }
    console.log(`Signup successful for ${user.email} | userId: ${signupUserId}`);

    // 2️⃣ Verify
    const verifyResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/auth/verify-user',
      {
        data: { userId: signupUserId, otp: 123456 }
      }
    );

    if (!verifyResp.ok()) {
      const errorBody = await verifyResp.text();
      console.error(`Verification failed for ${user.email}:`, errorBody);
      continue;
    }

    const verifyData = await verifyResp.json();
    const verifiedUserId = verifyData.user?.id;
    const token = verifyData.tokens?.access_token;

    if (!verifiedUserId || !token) {
      console.error(`Verification did not return proper userId or token for ${user.email}`);
      continue;
    }
    console.log(`Verification successful for ${user.email} | token: ${token.slice(0,10)}...`);

    // 3️⃣ Apply to job using verifiedUserId and token
    const applyPayload = {
      jobId: JOB_ID,
      videoUrl: VIDEO_URL,
      questionAnswers: [
        { jobQuestionId: 'f04b4b8b-083d-46e6-a105-9dcf2f09ee39', answer: 'yes' },
        { jobQuestionId: 'e88ccc1d-fbad-43f8-95cf-58da748779df', answerJson: true },
        { jobQuestionId: '302f599e-5418-4ae2-8656-b3d3d46e4b34', answer: VIDEO_URL }
      ]
    };

    const applyResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/applications/create/submit',
      {
        data: applyPayload,
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!applyResp.ok()) {
      const errorBody = await applyResp.text();
      console.error(`Job application failed for ${user.email}:`, errorBody);
      continue;
    }

    console.log(`Job applied successfully for ${user.email}`);
  }
});
