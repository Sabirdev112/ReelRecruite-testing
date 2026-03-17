import { test as base } from '@playwright/test';
import { Login } from '../pages/Login.js';
import { UpdateAboutPage } from '../pages/UpdateAbout.js';
import { SignupPage } from '../pages/SignupPage.js';
import { CreateJobPage } from '../pages/CreateJobPage.js';
import { ApplyJobPage } from '../pages/ApplyJobPage.js';
import { ArchiveChatPage } from '../pages/ArchiveChat.js';
import { ChangePassword } from '../pages/ChangePassword.js';
import { UploadResume } from '../pages/ChangeResume.js';
import { deleteJobPage } from '../pages/DeleteJob.js';
import { EditJobPage } from '../pages/EditJob.js';
import { FilterPage } from '../pages/Filter.js';
import { ForgetPassword } from '../pages/ForgetPassword.js';
import { SaveDraft } from '../pages/SaveDraft.js';
import { SearchJob } from '../pages/SearchJob.js';
import { SeeCoverVideoPage } from '../pages/SeeCoverVideo.js';
import { SeeResumePage } from '../pages/SeeResume.js';
import { SendMessagePage } from '../pages/SendMessagePage.js';
import { ShortlistCandidatePage } from '../pages/ShortListCandidate.js';
import { CompanyDetailsPage } from '../pages/UpdateCompanyDetails.js';
import { UpdateEducationPage } from '../pages/UpdateEducation.js';
import { UpdateInfoPage } from '../pages/UpdateInfo.js';
import { UpdateSkillsPage } from '../pages/UpdateSkils.js';
import { UpdateWorkPage } from '../pages/UpdateWork.js';
import { UpdateCoverVideoResumePage } from '../pages/UploadCoverVideo.js';
import { viewAppliedJobPage } from '../pages/ViewAppliedJob.js';
import { ViewReelsPage } from '../pages/ViewReels.js';
import { withdrawPage } from '../pages/WithdrawApplication.js';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new Login(page));
    },
    updateAboutPage: async ({ page }, use) => {
        await use(new UpdateAboutPage(page));
    },
    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },
    createJobPage: async ({ page }, use) => {
        await use(new CreateJobPage(page));
    },
    applyJobPage: async ({ page }, use) => {
        await use(new ApplyJobPage(page));
    },
    archiveChat: async ({ page }, use) => {
        await use(new ArchiveChatPage(page));
    },
    changePassword: async ({ page }, use) => {
        await use(new ChangePassword(page));
    },
    changeResume: async ({ page }, use) => {
        await use(new UploadResume(page));
    },
    deleteJob: async ({ page }, use) => {
        await use(new deleteJobPage(page));
    },
    editJob: async ({ page }, use) => {
        await use(new EditJobPage(page));
    },
    filter: async ({ page }, use) => {
        await use(new FilterPage(page));
    },
    forgetPassword: async ({ page }, use) => {
        await use(new ForgetPassword(page));
    },
    saveDraft: async ({ page }, use) => {
        await use(new SaveDraft(page));
    },
    searchJob: async ({ page }, use) => {
        await use(new SearchJob(page));
    },
    seeCoverVideo: async ({ page }, use) => {
        await use(new SeeCoverVideoPage(page));
    },
    seeResume: async ({ page }, use) => {
        await use(new SeeResumePage(page));
    },
    sendMessagePage: async ({ page }, use) => {
        await use(new SendMessagePage(page));
    },
    shortListCandidate: async ({ page }, use) => {
        await use(new ShortlistCandidatePage(page));
    },
    updateCompanyDetails: async ({ page }, use) => {
        await use(new CompanyDetailsPage(page));
    },
    updateEducation: async ({ page }, use) => {
        await use(new UpdateEducationPage(page));
    },
    updateInfo: async ({ page }, use) => {
        await use(new UpdateInfoPage(page));
    },
    updateSkils: async ({ page }, use) => {
        await use(new UpdateSkillsPage(page));
    },
    updateWork: async ({ page }, use) => {
        await use(new UpdateWorkPage(page));
    },
    uploadCoverVideo: async ({ page }, use) => {
        await use(new UpdateCoverVideoResumePage(page));
    },
    viewAppliedJob: async ({ page }, use) => {
        await use(new viewAppliedJobPage(page));
    },
    viewReels: async ({ page }, use) => {
        await use(new ViewReelsPage(page));
    },
    withdrawApplication: async ({ page }, use) => {
        await use(new withdrawPage(page));
    }
});

export { expect, chromium, firefox, webkit, devices } from '@playwright/test';
