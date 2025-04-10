import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Department/DepartmentRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();
const departmentDao = new DepartmentDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();
const processInstanceId = execution.getProcessInstanceId();

const task = process.getVariable(executionId, "task");
const employeeId = process.getVariable(executionId, "Employee");

const newHire = employeeDao.findById(employeeId);
if (!newHire) {
  throw new Error(`Employee with ID ${employeeId} not found!`);
}

const employee = employeeDao.findById(task.Assignee);
if (!employee) {
  throw new Error(`Employee with ID ${task.Assignee} not found!`);
}

const departmentName = departmentDao.findById(newHire.Department).Name;

const subject = task.Name;
console.log("Subject: ", subject);

const finalLink = `${task.Link}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://github.com/codbex/codbex.github.io/blob/main/docs/images/logos/codbex-logo.png" alt="Company Logo" style="max-width: 150px; height: auto;">
    </div>
    <h2 style="color: #2c3e50; text-align: center;">New Onboarding Task Assigned</h2>
    <p>Dear ${employee.Name},</p>
    <p>You have been assigned a new onboarding task related to <strong>${newHire.Name}</strong> (Department: <strong>${departmentName}</strong>).</p>
    <p>Please click the button below to access your inbox and complete the required steps:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${finalLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Fulfill Task</a>
    </div>
    <p>If you have any questions or need support, please contact the HR team.</p>
    <p>Best regards,<br>Your HR Team</p>
  </div>
`;


sendMail(employee.Email, subject, content);