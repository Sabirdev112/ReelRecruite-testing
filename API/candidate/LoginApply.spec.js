import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fetch } from 'undici';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ----------- Load candidate users -----------
const users = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
);

// ----------- Load jobId from fixture -----------
const { jobId: JOB_ID } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/jobid.json'),
    'utf-8'
  )
);

// ----------- Videos setup -----------
const videosFolder = path.join(process.cwd(), 'videos');
const videoFiles = fs.readdirSync(videosFolder).filter(file => file.endsWith('.mp4'));

// ----------- Cloudinary credentials -----------
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

// ----------- Question answers -----------
const questionAnswers = [
  { jobQuestionId: '028febd6-e729-4508-a249-e7644ee5b86d', answer: '5' },
  { jobQuestionId: '22e2a816-741b-407e-a507-1859c55d0e38', answerJson: true },
  { jobQuestionId: 'af65651e-2ffa-4f28-a922-1d823a648c10', answer: '25k' }
];

test('Sign in users and apply job with video and questions', async ({ request }) => {
  let videoIndex = 0;

  for (const user of users) {
    console.log(`\nProcessing: ${user.email}`);

    // ----------- Sign in -----------
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

    if (!token) {
      console.error(`Token missing for ${user.email}`);
      continue;
    }

    // ----------- Select video -----------
    if (videoIndex >= videoFiles.length) break;

    const videoPath = path.join(videosFolder, videoFiles[videoIndex++]);

    // ----------- Upload video -----------
    let videoUrl;
    try {
      videoUrl = await uploadVideoToCloudinary(videoPath);
    } catch (err) {
      console.error(`Video upload failed for ${user.email}:`, err.message);
      continue;
    }

    // ----------- Apply to job -----------
    const applyResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/applications/create/submit',
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          jobId: JOB_ID,
          videoUrl,
          questionAnswers
        }
      }
    );

    if (!applyResp.ok()) {
      console.error(`Apply failed for ${user.email}:`, await applyResp.text());
      continue;
    }

    console.log(`Job applied successfully for ${user.email}`);
  }
});
