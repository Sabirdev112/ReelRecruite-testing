import { NextResponse } from 'next/server';
import { runAllTests } from '@/lib/processManager';
import path from 'path';

export async function POST() {
  // process.cwd() in Next.js points to the 'dashboard' folder
  const rootDir = path.resolve(process.cwd(), '..');
  const playwrightCliPath = path.join(rootDir, 'node_modules/@playwright/test/cli.js');

  const testFiles = [
    'tests/e2e/Signup.spec.js',
    'tests/e2e/Recruiter/ForgetPassword.spec.js',
    'tests/e2e/candidate/PhoneLogin.spec.js',
    'tests/e2e/candidate/ChangePassword.spec.js',
    'tests/e2e/Login.spec.js',
    'tests/e2e/Recruiter/UpdateInfo.spec.js',
    'tests/e2e/Recruiter/UpdateAbout.spec.js',
    'tests/e2e/Recruiter/UpdateCompany.spec.js',
    'tests/e2e/candidate/UpdateInfo.spec.js',
    'tests/e2e/candidate/UpdateAbout.spec.js',
    'tests/e2e/candidate/UpdateSkill.spec.js',
    'tests/e2e/candidate/UpdateWork.spec.js',
    'tests/e2e/candidate/UpdateEducation.spec.js',
    'tests/e2e/candidate/UpdateResume.spec.js',
    'tests/e2e/candidate/UpdateCoverVideo.spec.js',
    'tests/e2e/candidate/FIlter.spec.js',
    'tests/e2e/candidate/workTypeFilter.spec.js',
    'tests/e2e/candidate/regionFilter.spec.js',
    'tests/e2e/candidate/jobtype.spec.js',
    'tests/e2e/candidate/experienceLevelFilter.spec.js',
    'tests/e2e/candidate/currencyFilter.spec.js',
    'tests/e2e/candidate/SearchJob.spec.js',
    'tests/e2e/Recruiter/SaveDraft.spec.js',
    'tests/e2e/Recruiter/CreateJob.spec.js',
    'tests/e2e/Recruiter/EditJob.spec.js',
    'tests/e2e/candidate/jobApply.spec.js',
    'tests/e2e/Recruiter/viewApplications.spec.js',
    'tests/e2e/Recruiter/ShortlistCandidate.spec.js',
    'tests/e2e/Recruiter/SeeResume.spec.js',
    'tests/e2e/Recruiter/SeeCoverVideo.spec.js',
    'tests/e2e/Recruiter/sendMessage.spec.js',
    'tests/e2e/Recruiter/ArchiveChat.spec.js',
    'tests/e2e/Recruiter/UnArchiveChat.spec.js',
    'tests/e2e/candidate/withdrawApplication.spec.js',
    'tests/e2e/candidate/ViewAppliedJobs.spec.js',
    'tests/e2e/Recruiter/DeleteJob.spec.js'
  ];

  try {
    const initiated = await runAllTests(testFiles, playwrightCliPath, rootDir, 'Full E2E Suite');
    
    if (initiated) {
      return NextResponse.json({ success: true, message: 'Full suite initiated' });
    } else {
      return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 409 });
    }
  } catch (err) {
    console.error('API Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
