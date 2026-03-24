import { NextResponse } from 'next/server';
import { runApiTests } from '@/lib/processManager';
import path from 'path';

export async function POST() {
  const rootDir = path.resolve(process.cwd(), '..');
  const playwrightCliPath = path.join(rootDir, 'node_modules/@playwright/test/cli.js');

  // 1:1 parity with the 36 UI specs
  const testFiles = [
    'tests/api/Signup.spec.js',
    'tests/api/Recruiter/ForgetPassword.spec.js',
    'tests/api/candidate/PhoneLogin.spec.js',
    'tests/api/candidate/ChangePassword.spec.js',
    'tests/api/Login.spec.js',
    'tests/api/Recruiter/UpdateInfo.spec.js',
    'tests/api/Recruiter/UpdateAbout.spec.js',
    'tests/api/Recruiter/UpdateCompany.spec.js',
    'tests/api/candidate/UpdateInfo.spec.js',
    'tests/api/candidate/UpdateAbout.spec.js',
    'tests/api/candidate/UpdateSkill.spec.js',
    'tests/api/candidate/UpdateWork.spec.js',
    'tests/api/candidate/UpdateEducation.spec.js',
    'tests/api/candidate/UpdateResume.spec.js',
    'tests/api/candidate/UpdateCoverVideo.spec.js',
    'tests/api/candidate/FIlter.spec.js',
    'tests/api/candidate/workTypeFilter.spec.js',
    'tests/api/candidate/regionFilter.spec.js',
    'tests/api/candidate/jobtype.spec.js',
    'tests/api/candidate/experienceLevelFilter.spec.js',
    'tests/api/candidate/currencyFilter.spec.js',
    'tests/api/candidate/SearchJob.spec.js',
    'tests/api/Recruiter/SaveDraft.spec.js',
    'tests/api/Recruiter/CreateJob.spec.js',
    'tests/api/Recruiter/EditJob.spec.js',
    'tests/api/candidate/jobApply.spec.js',
    'tests/api/Recruiter/viewApplications.spec.js',
    'tests/api/Recruiter/ShortlistCandidate.spec.js',
    'tests/api/Recruiter/SeeResume.spec.js',
    'tests/api/Recruiter/SeeCoverVideo.spec.js',
    'tests/api/Recruiter/sendMessage.spec.js',
    'tests/api/Recruiter/ArchiveChat.spec.js',
    'tests/api/Recruiter/UnArchiveChat.spec.js',
    'tests/api/candidate/withdrawApplication.spec.js',
    'tests/api/candidate/ViewAppliedJobs.spec.js',
    'tests/api/Recruiter/DeleteJob.spec.js'
  ];

  try {
    const initiated = await runApiTests(testFiles, playwrightCliPath, rootDir, 'API Full Suite Audit');
    if (initiated) {
      return NextResponse.json({ success: true, message: 'API Full suite initiated' });
    } else {
      return NextResponse.json({ success: false, message: 'A run is already in progress' }, { status: 409 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
