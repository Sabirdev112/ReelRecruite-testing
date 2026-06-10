import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESPONSES_PATH = path.join(__dirname, 'responses.json');
const RECRUITER_CREDS_PATH = path.join(__dirname, '../test-data/Recruiter/Credentials.json');
const CANDIDATE_CREDS_PATH = path.join(__dirname, '../test-data/Candidate/Credentials.json');
const API_JOBID_PATH = path.join(__dirname, '../test-data/api/jobid.json');
const API_APPLICATIONID_PATH = path.join(__dirname, '../test-data/api/applicationId.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/** First matching row from tests/test-data/{Recruiter,Candidate}/Credentials.json */
function readCredentialRow(filePath, role) {
  const list = readJson(filePath);
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error(`Credentials file is empty or invalid: ${filePath}`);
  }
  const roleLower = (role || '').toLowerCase();
  const found = list.find(
    (row) => (row.userType || '').toLowerCase() === roleLower,
  );
  const row = found || list[0];
  if (!row?.email || row.password === undefined) {
    throw new Error(
      `Credentials entry needs email and password in ${filePath}`,
    );
  }
  return row;
}

/** Email / password / optional phone for API sign-in and placeholders */
function resolveRoleCredentials(role) {
  if (role === 'recruiter') {
    const row = readCredentialRow(RECRUITER_CREDS_PATH, 'recruiter');
    return {
      email: row.email,
      password: row.password,
      phone: row.phone,
    };
  }
  if (role === 'candidate') {
    const row = readCredentialRow(CANDIDATE_CREDS_PATH, 'candidate');
    return {
      email: row.email,
      password: row.password,
      phone: row.phone,
    };
  }
  return { email: '', password: '', phone: '' };
}

// Setup phone format
function phoneApiFormat(raw) {
  if (!raw || typeof raw !== 'string') return raw;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('92')) {
    return `(+92)${digits.slice(2)}`;
  }
  if (digits.length === 11) {
    return `(+92)${digits}`;
  }
  return raw;
}

// Build Placeholder
function buildPlaceholderMap() {
  const recruiterAuth = resolveRoleCredentials('recruiter');
  const candidateAuth = resolveRoleCredentials('candidate');
  let candidatePhone = candidateAuth.phone
    ? String(candidateAuth.phone)
    : '';
  if (!candidatePhone) {
    const list = readJson(CANDIDATE_CREDS_PATH);
    if (Array.isArray(list)) {
      const row = list.find((r) => r.phone);
      if (row?.phone != null) candidatePhone = String(row.phone);
    }
  }
  let jobId;
  let applicationId;
  try {
    jobId = readJson(API_JOBID_PATH).jobId;
  } catch {
    jobId = '';
  }
  try {
    applicationId = readJson(API_APPLICATIONID_PATH).applicationId;
  } catch {
    applicationId = '';
  }
  return {
    '{{recruiter.email}}': recruiterAuth.email,
    '{{recruiter.password}}': String(recruiterAuth.password ?? ''),
    '{{candidate.email}}': candidateAuth.email,
    '{{candidate.password}}': String(candidateAuth.password ?? ''),
    '{{candidate.phone}}': candidatePhone,
    '{{candidate.phoneApi}}':
      phoneApiFormat(candidatePhone) || candidatePhone,
    '{{jobId}}': jobId,
    '{{applicationId}}': applicationId,
    '{{uniqueSignupEmail}}': `${Date.now()}_${Math.random().toString(36).slice(2, 10)}@testmail.dev`,
    '{{chatId}}': '5ebf38d4-6aed-4b5e-b68b-4067040e03e7',
  };
}

// Apply placeholder
function applyPlaceholders(value, map) {
  if (typeof value === 'string') {
    let s = value;
    for (const [k, v] of Object.entries(map)) {
      s = s.split(k).join(String(v));
    }
    return s;
  }
  if (Array.isArray(value)) {
    return value.map((x) => applyPlaceholders(x, map));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = applyPlaceholders(v, map);
    }
    return out;
  }
  return value;
}

// create a random user
export function createSignupUser() {

  const allResponses = JSON.parse(fs.readFileSync(RESPONSES_PATH, 'utf-8'));
  const signupPayload = allResponses.Signup?.payload;

  if (!signupPayload) throw new Error('Signup payload not found in responses.json');

  const email = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}@testmail.dev`;
  const phone = '92' + Math.floor(Math.random() * 1e9).toString().padStart(9, '0');

  return {
    fullName: signupPayload.fullName,
    email,
    phone,
    password: signupPayload.password,
    userType: signupPayload.userType,
  };
}

// Get Job data
export function getJobPayload() {
  const allResponses = JSON.parse(fs.readFileSync(RESPONSES_PATH, 'utf-8'));
  const jobPayload = allResponses.CreateJob?.payload;

  if (!jobPayload) throw new Error('CreateJob payload not found in responses.json');

  return JSON.parse(JSON.stringify(jobPayload));
}

// Get users from newusers.json
// export function getAllUsers() {
//   if (!fs.existsSync(NEW_USERS_FILE)) {
//     throw new Error('newusers.json not found. No users to run tests.');
//   }

//   const users = JSON.parse(fs.readFileSync(NEW_USERS_FILE, 'utf-8'));
//   return users;
// }

// API Response Helper
export async function apiResponse(response, testInfo) {
  let responseBody;

  try {
    const text = await response.text();
    try {
      responseBody = JSON.parse(text);
    } catch {
      responseBody = text;
    }
  } catch {
    responseBody = 'Unable to read response body';
  }

  await testInfo.attach('api-response', {
    body: Buffer.from(
      JSON.stringify({
        status: response.status(),
        body: responseBody,
      }),
    ),
    contentType: 'application/json',
  });
}


export async function runApiCase(request, testInfo, caseKey, options = {}) {
  const all = readJson(RESPONSES_PATH);
  const baseUrl = all._meta?.baseUrl;
  if (!baseUrl) {
    throw new Error('responses.json missing _meta.baseUrl');
  }

  const def = all[caseKey];
  if (!def || typeof def !== 'object') {
    throw new Error(`Unknown API case "${caseKey}" in responses.json`);
  }

  const map = buildPlaceholderMap();
  if (options.refreshUniqueSignupEmail) {
    map['{{uniqueSignupEmail}}'] = `api_${Date.now()}_${Math.random().toString(36).slice(2, 10)}@testmail.dev`;
  }
  if (options.placeholderOverrides) {
    Object.assign(map, options.placeholderOverrides);
  }

  const method = def.method;
  const endpoint = def.endpoint;
  if (!method || !endpoint) {
    throw new Error(`Case "${caseKey}" needs method and endpoint`);
  }

  let headers = { ...(def.headers || {}) };
  let payload =
    def.payload !== undefined ? structuredClone(def.payload) : undefined;

  payload = applyPlaceholders(payload, map);

  async function signInForRole() {
    if (def.authRole !== 'recruiter' && def.authRole !== 'candidate') {
      return;
    }
    const { email, password } = resolveRoleCredentials(def.authRole);
    if (!email) {
      throw new Error(
        `Missing email for authRole "${def.authRole}" (check tests/test-data/${def.authRole === 'recruiter' ? 'Recruiter' : 'Candidate'}/Credentials.json)`,
      );
    }
    const loginRes = await request.post(`${baseUrl}/v1/auth/signin`, {
      data: {
        email,
        password,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.tokens?.access_token;
    if (!token) {
      throw new Error(
        `Auth failed for ${def.authRole}: ${JSON.stringify(loginBody)}`,
      );
    }
    headers.Authorization = `Bearer ${token}`;
  }

  await signInForRole();

  const query = def.query ? applyPlaceholders(def.query, map) : null;
  let url = `${baseUrl}${endpoint}`;
  if (query && Object.keys(query).length) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    const qstr = qs.toString();
    if (qstr) url += `?${qstr}`;
  }

  const hasBody =
    payload !== undefined &&
    payload !== null &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  async function sendOnce() {
    const hdrs = { ...headers };
    if (hasBody && !hdrs['Content-Type']) {
      hdrs['Content-Type'] = 'application/json';
    }
    const opts = { headers: hdrs };
    if (hasBody) opts.data = payload;
    if (method === 'GET') return request.get(url, opts);
    if (method === 'POST') return request.post(url, opts);
    if (method === 'PUT') return request.put(url, opts);
    if (method === 'PATCH') return request.patch(url, opts);
    if (method === 'DELETE') return request.delete(url, opts);
    throw new Error(`Unsupported method ${method}`);
  }

  const start = Date.now();
  let response = await sendOnce();
  if (response.status() === 419 && def.authRole) {
    await signInForRole();
    response = await sendOnce();
  }

  const duration = Date.now() - start;
  console.log(`[API ${caseKey}] ${method} ${endpoint} — ${duration}ms — HTTP ${response.status()}`);

  await apiResponse(response, testInfo);

  // Auto-store IDs if successful
  if (response.ok()) {
    let body;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (body) {
      if (caseKey === 'CreateJob' && body.job?.id) {
        writeJson(API_JOBID_PATH, { jobId: body.job.id });
        console.log(`[API] Stored jobId: ${body.job.id}`);
      } else if (caseKey === 'jobApply' && body.application?.id) {
        writeJson(API_APPLICATIONID_PATH, { applicationId: body.application.id });
        console.log(`[API] Stored applicationId: ${body.application.id}`);
      }
    }
  }

  const expected = Array.isArray(def.expectedStatus)
    ? def.expectedStatus
    : [def.expectedStatus];
  expect(
    expected,
    `Unexpected status for ${caseKey}: got ${response.status()}`,
  ).toContain(response.status());

  return response;
}
