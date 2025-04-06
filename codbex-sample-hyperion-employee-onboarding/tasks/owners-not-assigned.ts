import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const managerId = process.getVariable(executionId, "Manager");
let managerLink = process.getVariable(executionId, "ManagerLink");

const manager = employeeDao.findById(managerId);
if (!manager) {
  throw new Error(`Employee with ID ${managerId} not found!`);
}

const subject = "No Assignees to Onboarding Tasks";
const processInstanceId = execution.getProcessInstanceId();

managerLink = `${managerLink}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">No Assignees to Onboarding Tasks</h2>
    <p>Dear ${manager.Name},</p>
    <p>You haven't appointed assignees to all of the onboarding tasks.</p>
    <p>Please click the button below to access your inbox to complete the necessary steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${managerLink}" target="_blank" style="
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

sendMail(manager.Email, subject, content);
