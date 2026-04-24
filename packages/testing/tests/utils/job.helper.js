import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobIdPath = path.join(__dirname, '../test-data/Recruiter/jobid.json');

export function getLatestJobUrl() {
  const jobPath = jobIdPath;

  if (!fs.existsSync(jobPath)) {
    throw new Error('Job ID file not found. Create a job first.');
  }

  const { jobId } = JSON.parse(fs.readFileSync(jobPath, 'utf-8'));
  const jobUrl = "https://recruitai-web-production.up.railway.app/jobs/"+jobId;
  return jobUrl;
}


export function storeJobId(jobId) {
   const JOB_PATH = jobIdPath;
  if (!jobId) throw new Error('Cannot store empty jobId');

  const data = { jobId };
  fs.writeFileSync(JOB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Job ID stored successfully.', jobId );
}

export function getJobId(){
  const jobPath = jobIdPath;

  if (!fs.existsSync(jobPath)) {
    throw new Error('Job ID file not found. Create a job first.');
  }

  const { jobId } = JSON.parse(fs.readFileSync(jobPath, 'utf-8'));
  return jobId;
}
