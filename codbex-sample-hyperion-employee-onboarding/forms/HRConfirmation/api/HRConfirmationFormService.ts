import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { Controller, Get, Post } from "sdk/http";
import { tasks } from "sdk/bpm";

@Controller
class HRConfirmationService {

    private readonly onboardingTaskDao;
    private readonly employeeDao;

    constructor() {
        this.onboardingTaskDao = new OnboardingTaskDao();
        this.employeeDao = new EmployeeDao();
    }

    @Get("/tasksData/:employeeId")
    public tasksData(_: any, ctx: any) {
        const employeeId = ctx.pathParameters.employeeId;

        const tasks = this.onboardingTaskDao.findAll({
            $filter: {
                equals: {
                    Employee: employeeId,
                    Status: 3
                }
            }
        });

        const employees = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Id: employeeId
                }
            }
        });

        return {
            "Tasks": tasks,
            "Employee": employees[0].Status
        };
    }

    @Post("/completeTask/:processInstanceId")
    public completeTask(_: any, ctx: any) {
        const processInstanceId = ctx.pathParameters.processInstanceId;

        const processTask = tasks.list().filter(task => task.data.processInstanceId === processInstanceId);

        tasks.complete(processTask[0].data.id);
    }

}