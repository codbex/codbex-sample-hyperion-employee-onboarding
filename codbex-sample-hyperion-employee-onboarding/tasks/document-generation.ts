import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { process } from "sdk/bpm";

const onboardingTaskDao = new OnboardingTaskDao();
const employeeDao = new EmployeeDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const employeeId = process.getVariable(executionId, "Employee");
const taskLink = process.getVariable(executionId, "TaskLink");

const employee = employeeDao.findById(employeeId);
if (!employee) {
    throw new Error(`Employee with ID ${employeeId} not found!`);
}

const hrTaskSteps = `1. Gather required employee information.
2. Draft and review the employment contract.
3. Share the finalized contract with the new hire for signature.`;

let hrTaskBody = {
    "Employee": employeeId,
    "Name": "Contract Preparation",
    "Description": hrTaskSteps,
    "Status": 1,
    "Link": taskLink,
};

const itSetupSteps = `1. Request necessary hardware and software for the new hire.
2. Set up user accounts, email, and access permissions.
3. Test and confirm all systems are working before the start date.`;

let itTaskBody = {
    "Employee": employeeId,
    "Name": "IT Setup",
    "Description": itSetupSteps,
    "Status": 1,
    "Link": taskLink,
};

const departmentTrainingSteps = `1. Schedule training sessions with the relevant team or manager.
2. Provide access to training materials and documentation.
3. Monitor progress and address any questions or support needs.`;

let managerTaskBody = {
    "Employee": employeeId,
    "Name": "Department Training",
    "Description": departmentTrainingSteps,
    "Status": 1,
    "Link": taskLink,
};

let tasks = [hrTaskBody, itTaskBody, managerTaskBody];

tasks.forEach(task => {
    const newTask = onboardingTaskDao.create(task);

    if (!newTask) {
        throw new Error("Task creation failed!");
    }
})

execution.setVariable("tasks", tasks);

// Employee status set to In Progres
employee.Status = 2;

employeeDao.update(employee);
