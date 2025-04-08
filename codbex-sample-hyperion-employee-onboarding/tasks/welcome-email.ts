import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const employeeId = process.getVariable(executionId, "Employee");

const employee = employeeDao.findById(employeeId);
if (!employee) {
  throw new Error(`Employee with ID ${employeeId} not found!`);
}

const subject = "Welcome to the Team";

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #2c3e50; text-align: center;">Employee Onboarding Concluded Successfully</h2>
    <p>Dear ${employee.Name},</p>
    <p>Your onboarding process has concluded. We are glad to have you on our team.</p>
    <p>Please contact the HR team for the next steps.</p>
    <p>Best regards.</p>
  </div>
`;

sendMail(employee.Email, subject, content);
