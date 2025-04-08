import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";

import { Controller, Get, Post } from "sdk/http";
import { tasks } from "sdk/bpm";

@Controller
class HRConfirmationService {

    private readonly onboardingTaskDao;

    constructor() {
        this.onboardingTaskDao = new OnboardingTaskDao();
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
        return tasks;
    }

    @Post("/completeTask/:processInstanceId")
    public completeTask(_: any, ctx: any) {
        const processInstanceId = ctx.pathParameters.processInstanceId;

        const processTask = tasks.list().filter(task => task.data.processInstanceId === processInstanceId);

        tasks.complete(processTask[0].data.id);
    }

}