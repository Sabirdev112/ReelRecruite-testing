import { test } from '@playwright/test';
import fs from 'fs';

const users = JSON.parse(fs.readFileSync('../../fixtures/candidate/Credentials.json'));

for (const user of users) {
  test(`Update profile for ${user.email}`, async ({ request }) => {
    // 1️⃣ Sign in as candidate
    const loginResponse = await request.post('https://recruitai-backend-production.up.railway.app/v1/auth/signin', {
      data: {
        email: user.email,
        password: user.password
      }
    });

    const loginData = await loginResponse.json();
    if (loginData.code !== 1000) {
      console.log(`Failed to login for ${user.email}:`, loginData.message);
      return;
    }

    const token = loginData.tokens.access_token;
    console.log(`✅ Logged in as ${user.email}`);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2️⃣ Update Profile Info
    const profileInfo = { fullName: 'Candidate One', title: 'SQA Engineer' };
    const profileRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update',
      { data: profileInfo, headers }
    );
    console.log(`Profile info updated for ${user.email}:`, await profileRes.json());

    // 3️⃣ Update About
    const aboutData = { bio: 'I am a SQA engineer been working', location: 'USA', country: 'Pakistan', phone: '880898377883777' };
    const aboutRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update',
      { data: aboutData, headers }
    );
    console.log(`About section updated for ${user.email}:`, await aboutRes.json());

    // 4️⃣ Update Skills
    const skillsData = { skills: ['playwright', 'selenium', 'cypress'] };
    const skillsRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update-c/candidate-profile',
      { data: skillsData, headers }
    );
    console.log(`Skills updated for ${user.email}:`, await skillsRes.json());

    // 5️⃣ Update Work Experience
    const workData = {
      workExperience: [
        {
          company: 'Google',
          position: 'Developer',
          employmentType: 'full-time',
          location: 'USA',
          locationType: 'remote',
          startDate: '2022-02-24',
          endDate: null,
          isCurrentlyWorking: true,
          description: 'I am working here',
          achievements: null,
          skills: null
        }
      ]
    };
    const workRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update-c/candidate-profile',
      { data: workData, headers }
    );
    console.log(`Work experience updated for ${user.email}:`, await workRes.json());

    // 6️⃣ Update Education
    const educationData = {
      education: [
        {
          institution: 'Harvard University',
          degree: 'Bachelors of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2021-02-20',
          endDate: null,
          isCurrentlyStudying: true,
          grade: '3.4',
          description: null,
          location: 'Cambridge'
        }
      ]
    };
    const educationRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update-c/candidate-profile',
      { data: educationData, headers }
    );
    console.log(`Education updated for ${user.email}:`, await educationRes.json());

    // 7️⃣ Update Resume
    const resumeData = { resumeUrl: 'https://res.cloudinary.com/dkxgyjj8a/raw/upload/v1765464939/resumes/pdf/dc77859e-5095-4dec-b4a5-5962ffdddf47_gatepass.pdf' };
    const resumeRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update-c/candidate-profile',
      { data: resumeData, headers }
    );
    console.log(`Resume updated for ${user.email}:`, await resumeRes.json());

    // 8️⃣ Update Video Resume
    const videoData = { coverVideo: 'https://res.cloudinary.com/dkxgyjj8a/video/upload/v1765465034/video-resumes/video/2217fef7-fb57-4803-b416-5a6c7da693ee_video1.mp4' };
    const videoRes = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/profile/update-c/candidate-profile',
      { data: videoData, headers }
    );
    console.log(`Video resume updated for ${user.email}:`, await videoRes.json());

    console.log(`✅ All updates done for ${user.email}`);
  });
}
