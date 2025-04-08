import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const onboardingInitiatorId = process.getVariable(executionId, "OnboardingInitiator");
let onboardingInitiatorLink = process.getVariable(executionId, "OnboardingInitiatorLink");

const onboardingInitiator = employeeDao.findById(onboardingInitiatorId);
if (!onboardingInitiator) {
  throw new Error(`Employee with ID ${onboardingInitiatorId} not found!`);
}

const subject = "Employee Onboarding Review";
const processInstanceId = execution.getProcessInstanceId();

onboardingInitiatorLink = `${onboardingInitiatorLink}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">Employee Onboarding Review</h2>
    <p>Dear ${onboardingInitiator.Name},</p>
    <p>An employee onboarding request requires your review and approval.</p>
    <p>Please click the button below to access your inbox and complete the necessary steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${onboardingInitiatorLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Review & Approve</a>
    </div>
    <p>If you have any questions, please reach out to the HR team.</p>
    <p>Best regards.</p>
  </div>
`;

sendMail(onboardingInitiator.Email, subject, content);
