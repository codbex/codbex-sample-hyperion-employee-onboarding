import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();
const processInstanceId = execution.getProcessInstanceId();

// Sending Task Mail to HR

const task = process.getVariable(executionId, "task");

console.log("Task: ", JSON.stringify(task));

const employee = employeeDao.findById(task.Assignee);
if (!employee) {
  throw new Error(`Employee with ID ${task.Assignee} not found!`);
}

const subject = task.Name;
console.log("Subject: ", subject);

const finalLink = `${task.Link}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">New Onboarding Task For You</h2>
    <p>Dear ${employee.Name},</p>
    <p>You have a new onboarding task.</p>
    <p>Please click the button below to access your inbox to complete the necessary steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${finalLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Fullfill Task</a>
    </div>
    <p>If you have any questions, please reach out to the HR team.</p>
    <p>Best regards.</p>
  </div>
`;

sendMail(employee.Email, subject, content);