import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Department/DepartmentRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();
const departmentDao = new DepartmentDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const managerId = process.getVariable(executionId, "Manager");
let managerLink = process.getVariable(executionId, "ManagerLink");
const employeeId = process.getVariable(executionId, "Employee");

const manager = employeeDao.findById(managerId);
if (!manager) {
  throw new Error(`Employee with ID ${managerId} not found!`);
}

const employee = employeeDao.findById(employeeId);
if (!employee) {
  throw new Error(`Employee with ID ${employeeId} not found!`);
}

const departmentName = departmentDao.findById(employee.Department).Name;

const subject = "No Assignees to Onboarding Tasks";
const processInstanceId = execution.getProcessInstanceId();

managerLink = `${managerLink}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://github.com/codbex/codbex.github.io/blob/main/docs/images/logos/codbex-logo.png" alt="Company Logo" style="max-width: 150px; height: auto;">
    </div>
    <h2 style="color: #2c3e50; text-align: center;">Action Needed: Assign Onboarding Tasks</h2>
    <p>Dear ${manager.Name},</p>
    <p>The onboarding process for <strong>${employee.Name}</strong> (Department: <strong>${departmentName}</strong>) has been approved, but some onboarding tasks still do not have assigned team members.</p>
    <p>To ensure a smooth onboarding experience, please review the tasks and assign the appropriate assignees as soon as possible.</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${managerLink}" target="_blank" style="
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      ">Review & Assign Tasks</a>
    </div>
    <p>If you have any questions or need assistance, please contact the HR team.</p>
    <p>Best regards,<br>Your HR Team</p>
  </div>
`;


sendMail(manager.Email, subject, content);
