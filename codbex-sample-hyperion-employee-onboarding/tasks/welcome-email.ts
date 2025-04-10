import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Department/DepartmentRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();
const departmentDao = new DepartmentDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const employeeId = process.getVariable(executionId, "Employee");

const employee = employeeDao.findById(employeeId);
if (!employee) {
  throw new Error(`Employee with ID ${employeeId} not found!`);
}

const departmentName = departmentDao.findById(employee.Department).Name;

const subject = "Welcome to the Team";

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://github.com/codbex/codbex.github.io/blob/main/docs/images/logos/codbex-logo.png" alt="Company Logo" style="max-width: 150px; height: auto;">
    </div>
    <h2 style="color: #2c3e50; text-align: center;">Welcome to the Team!</h2>
    <p>Dear ${employee.Name},</p>
    <p>We are excited to inform you that your onboarding process has been successfully completed!</p>
    <p>Welcome aboard <strong>${employee.Name}</strong> — we’re thrilled to have you join the <strong>${departmentName}</strong> team.</p>
    <p>If you have any questions or need assistance with your next steps, please feel free to contact the HR team.</p>
    <p>Best regards,<br>Your HR Team</p>
  </div>
`;

sendMail(employee.Email, subject, content);
