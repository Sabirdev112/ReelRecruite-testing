import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500'], // signup is heavier than login
  },
};

export default function () {
  const url =
    'https://recruitai-backend-production.up.railway.app/v1/auth/signup';

  const uniqueId = `${Date.now()}-${__VU}-${__ITER}`;

  // Generate a valid phone number in the format (+92)XXXXXXXXXX
  const phoneNumber = `(+92)${Math.floor(1000000000 + Math.random() * 8999999999)}`;

  const payload = JSON.stringify({
    fullName: `k6 User ${uniqueId}`,
    email: `k6_user_${uniqueId}@testmail.dev`,
    phone: phoneNumber,
    password: 'Test@1234',
    userType: 'candidate', // valid option: 'candidate' or 'recruiter'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  const success = check(res, {
    'signup status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });

  // Log failed requests
  if (!success) {
    console.log(
      `FAILED REQUEST: Status=${res.status}, URL=${url}, Response=${res.body}`
    );
  }

  sleep(1);
}
