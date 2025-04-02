import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";

const onboardingTaskDao = new OnboardingTaskDao();
const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const employeeId = process.getVariable(executionId, "Employee");

const employee = employeeDao.findById(employeeId);
if (!employee) {
    throw new Error(`Employee with ID ${employeeId} not found!`);
}

const hrTaskBody = {
    "Employee": employeeId,
    "Name": "Contract Preparation",
    "Status": 1
};

const itTaskBody = {
    "Employee": employeeId,
    "Name": "IT Setup",
    "Status": 1
};

const managerTaskBody = {
    "Employee": employeeId,
    "Name": "Department Training",
    "Status": 1
};

const newHrTask = onboardingTaskDao.create(hrTaskBody);

if (!newHrTask) {
    throw new Error("HR Task creation failed!");
}

const newItTask = onboardingTaskDao.create(itTaskBody);

if (!newItTask) {
    throw new Error("IT Task creation failed!");
}

const newManagerTask = onboardingTaskDao.create(managerTaskBody);

if (!newManagerTask) {
    throw new Error("Manager Task creation failed!");
}

employee.OnboardingStatus = 2;

employeeDao.update(employee);
