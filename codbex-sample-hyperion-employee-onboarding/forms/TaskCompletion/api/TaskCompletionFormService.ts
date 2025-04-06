import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";

import { Controller, Get, Post } from "sdk/http";


@Controller
class TaskCompletionFormService {

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
                    Status: 2 // in progress
                }
            }
        });
        return tasks;
    }

    @Post("/completeTask")
    public completeTask(body: any) {

        let task = this.onboardingTaskDao.findById(body.Id);
        task.Status = 3; //completed

        this.onboardingTaskDao.update(task);
    }


}