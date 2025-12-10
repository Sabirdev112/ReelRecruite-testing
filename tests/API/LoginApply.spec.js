import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const JOB_ID = '0ecbefe5-c622-4d1e-baee-83145a4b3f09';
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

test('Sign in users and apply job with unique video', async ({ request }) => {
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
      questionAnswers: [] // ignoring optional video question
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
