import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Department/DepartmentRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();
const departmentDao = new DepartmentDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const onboardingInitiatorId = process.getVariable(executionId, "OnboardingInitiator");
let onboardingInitiatorLink = process.getVariable(executionId, "OnboardingInitiatorLink");
const employeeId = process.getVariable(executionId, "Employee");

const onboardingInitiator = employeeDao.findById(onboardingInitiatorId);
if (!onboardingInitiator) {
  throw new Error(`Employee with ID ${onboardingInitiatorId} not found!`);
}

const newHire = employeeDao.findById(employeeId);
if (!newHire) {
  throw new Error(`Employee with ID ${employeeId} not found!`);
}

const departmentName = departmentDao.findById(newHire.Department).Name;

const subject = "Employee Onboarding Review";
const processInstanceId = execution.getProcessInstanceId();

onboardingInitiatorLink = `${onboardingInitiatorLink}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: left; margin-bottom: 20px;">
      <img src="https://raw.githubusercontent.com/codbex/codbex.github.io/main/docs/images/logos/codbex-logo.png" alt="Company Logo" style="width: 50px; height: 50px;">
    </div>
    <h2 style="color: #2c3e50; text-align: center;">Employee Onboarding Final Review</h2>
    <p>Dear ${onboardingInitiator.Name},</p>
    <p>The onboarding process for <strong>${newHire.Name}</strong> (Department: <strong>${departmentName}</strong>) has been completed by the assigned team members and now requires your final review and approval.</p>
    <p>Please click the button below to access your inbox and complete the final steps:</p>
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
    <p style="text-align: center; font-size: 14px; color: #555;">
      Alternatively, you can access it here: 
      <a href="${onboardingInitiatorLink}" target="_blank" style="color: #007bff; text-decoration: underline;">
        Review and Approve Onboarding
      </a>
    </p>
    <p>If you have any questions or need assistance, please reach out to the HR team.</p>
    <p>Best regards.</p>
  </div>
`;

sendMail(onboardingInitiator.Email, subject, content);
