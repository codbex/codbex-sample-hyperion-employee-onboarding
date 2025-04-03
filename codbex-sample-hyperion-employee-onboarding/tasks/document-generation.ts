import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";

const onboardingTaskDao = new OnboardingTaskDao();
const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const employeeId = process.getVariable(executionId, "Employee");
const hrLink = process.getVariable(executionId, "HRLink");
const itLink = process.getVariable(executionId, "ITLink");
let trainingManagerLink = process.getVariable(executionId, "TrainingManagerLink");

const employee = employeeDao.findById(employeeId);
if (!employee) {
    throw new Error(`Employee with ID ${employeeId} not found!`);
}

const hrTaskBody = {
    "Employee": employeeId,
    "Name": "Contract Preparation",
    "Status": 1,
    "Link": hrLink,
};

const itTaskBody = {
    "Employee": employeeId,
    "Name": "IT Setup",
    "Status": 1,
    "Link": itLink,
};

const managerTaskBody = {
    "Employee": employeeId,
    "Name": "Department Training",
    "Status": 1,
    "Link": trainingManagerLink,
};

const tasks = [hrTaskBody, itTaskBody, managerTaskBody];

tasks.forEach(task => {
    const newTask = onboardingTaskDao.create(task);

    if (!newTask) {
        throw new Error("Task creation failed!");
    }
})

execution.setVariable("tasks", tasks);

// Employee status set to In Progres
employee.OnboardingStatus = 2;

employeeDao.update(employee);
