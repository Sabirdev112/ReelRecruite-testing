import { test, request } from '@playwright/test';

test('Sign in and create job with questions', async () => {
  // 1. Create a request context
  const apiContext = await request.newContext();

  // 2. Sign in
  const signinResponse = await apiContext.post('https://recruitai-backend-production.up.railway.app/v1/auth/signin', {
    data: {
      email: 'carlos@gmail.com',
      password: 'Carlos@123'
    }
  });
  const signinData = await signinResponse.json();
  console.log('Signin response:', signinData);

  const accessToken = signinData.tokens.access_token;

  // 3. Job payload with questions
  const jobPayload = {
    id: "eacb29c9-ea3c-41ca-895c-5b89e421561a",
    recruiterId: "ee568c89-8dde-4c75-9431-0382c9e2e90b",
    companyId: "27dfa07f-ee9e-4a29-842c-28588b114754",
    isAnonymous: false,
    status: "active",
    isDeleted: false,
    title: "Angular Developer",
    highlight: "We are looking for an Angular Developer to build and maintain responsive web applications. The role involves developing reusable components, optimizing performance, integrating with APIs, and collaborating with cross-functional teams. The ideal candidate stays updated with Angular trends, follows best coding practices, troubleshoots issues efficiently, and ensures scalable, high-quality solutions for a seamless user experience.",
    location: "",
    region: "Asia",
    jobType: "part-time",
    workType: "on-site",
    experienceLevel: "senior",
    salaryRange: "20000",
    currency: "usd",
    description: "<p>We are seeking a skilled Angular Developer to design, develop, and maintain high-quality web applications. The role involves:</p><ol><li data-list=\"bullet\">Developing modular, reusable, and maintainable Angular components.</li><li data-list=\"bullet\">Optimizing application performance and ensuring responsiveness across devices.</li><li data-list=\"bullet\">Integrating with RESTful APIs and third-party services efficiently.</li><li data-list=\"bullet\">Collaborating with cross-functional teams including designers, backend developers, and QA.</li><li data-list=\"bullet\">Following best coding practices and ensuring scalable, robust solutions.</li><li data-list=\"bullet\">Staying updated with the latest Angular trends, tools, and technologies.</li></ol>",
    requiredSkills: ["Angular", "Typescript", "Javascript", "TailwindCSS"],
    requirements: ["Bachelors of Science in computer science"],
    tags: [],
    expiresAt: "2025-12-21T18:59:59.999Z",
    createdAt: "2025-12-11T15:49:10.468Z",
    updatedAt: "2025-12-11T15:49:10.468Z",
    questions: [
      {
        "question": "How many years of Experience do you have",
        "questionType": "text",
        "isRequired": true,
        "orderIndex": 0
      },
      {
        "orderIndex": 1,
        "isRequired": true,
        "questionType": "boolean",
        "question": "Are you comfortable to relocate?"
      },
      {
        "question": "What's your current salary?",
        "questionType": "text",
        "isRequired": true,
        "orderIndex": 2
      }
    ]
  };

  // 4. Create job
  const createJobResponse = await apiContext.post('https://recruitai-backend-production.up.railway.app/v1/jobs/create', {
    data: jobPayload,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const createJobData = await createJobResponse.json();
  console.log('Job creation response:', createJobData);
});

