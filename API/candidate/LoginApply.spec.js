import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch'; // required for Cloudinary upload

const users = JSON.parse(fs.readFileSync('../../fixtures/candidate/Credentials.json', 'utf-8'));
const JOB_ID = 'a18e25af-08ad-4f67-ae40-6d4255661161';
const videosFolder = path.join(process.cwd(), 'videos'); // path to videos folder
const videoFiles = fs.readdirSync(videosFolder).filter(file => file.endsWith('.mp4'));

// Cloudinary credentials
const CLOUDINARY_UPLOAD_PRESET = 'videos';
const CLOUDINARY_CLOUD_NAME = 'dtndx858m';

async function uploadVideoToCloudinary(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: 'POST', body: form }
  );

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error(`Failed to upload video: ${JSON.stringify(data)}`);
  }
  return data.secure_url;
}

// Job questions and answers
const jobQuestions = [
  {
    question: "How many years of Experience do you have",
    questionType: "text",
    isRequired: true,
    orderIndex: 0
  },
  {
    orderIndex: 1,
    isRequired: true,
    questionType: "boolean",
    question: "Are you comfortable to relocate?"
  },
  {
    question: "What's your current salary?",
    questionType: "text",
    isRequired: true,
    orderIndex: 2
  }
];

const questionAnswers = [
  { jobQuestionId: "028febd6-e729-4508-a249-e7644ee5b86d", answer: "5" },
  { jobQuestionId: "22e2a816-741b-407e-a507-1859c55d0e38", answerJson: true },
  { jobQuestionId: "af65651e-2ffa-4f28-a922-1d823a648c10", answer: "25k" }
];

test('Sign in users and apply job with video and questions', async ({ request }) => {
  let videoIndex = 0;

  for (const user of users) {
    console.log(`\nProcessing: ${user.email}`);

    // 1️⃣ Sign in
    const loginResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/auth/signin',
      { data: { email: user.email, password: user.password } }
    );

    if (!loginResp.ok()) {
      console.error(`Login failed for ${user.email}:`, await loginResp.text());
      continue;
    }

    const loginData = await loginResp.json();
    const token = loginData.tokens?.access_token;
    const userId = loginData.user?.id;

    if (!token || !userId) {
      console.error(`Login did not return proper token or userId for ${user.email}`);
      continue;
    }
    console.log(`Login successful for ${user.email} | token: ${token.slice(0, 10)}...`);

    // 2️⃣ Pick video sequentially
    if (videoIndex >= videoFiles.length) {
      console.error(`Not enough videos for user ${user.email}`);
      break;
    }
    const videoPath = path.join(videosFolder, videoFiles[videoIndex]);
    videoIndex++;

    // 3️⃣ Upload video to Cloudinary
    let videoUrl;
    try {
      videoUrl = await uploadVideoToCloudinary(videoPath);
      console.log(`Uploaded video for ${user.email}: ${videoUrl}`);
    } catch (err) {
      console.error(`Failed to upload video for ${user.email}:`, err.message);
      continue;
    }

    // 4️⃣ Apply to job
    const applyPayload = {
      jobId: JOB_ID,
      videoUrl: videoUrl,
      questionAnswers: questionAnswers
    };

    const applyResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/applications/create/submit',
      { data: applyPayload, headers: { Authorization: `Bearer ${token}` } }
    );

    if (!applyResp.ok()) {
      console.error(`Job application failed for ${user.email}:`, await applyResp.text());
      continue;
    }

    console.log(`Job applied successfully for ${user.email}`);
  }
});
