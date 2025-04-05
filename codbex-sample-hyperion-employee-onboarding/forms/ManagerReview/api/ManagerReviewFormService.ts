import { OnboardingTaskRepository as OnboardingTaskDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/OnboardingTask/OnboardingTaskRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";

import { Controller, Get, Post } from "sdk/http";

@Controller
class ManagerReviewFormService {

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
                    Employee: employeeId
                }
            }
        });

        const unassignedTasks = tasks.filter(t => typeof t.Assignee !== 'number');

        return unassignedTasks;
    }

    @Get("/employeeData")
    public employeeData() {
        return this.employeeDao.findAll({
            $filter: {
                equals: {
                    OnboardingStatus: 3
                }
            }
        }).map(function (value) {
            return {
                value: value.Id,
                text: value.Name
            };
        });
    }

    @Get("/newHireData")
    public newHireData() {
        return this.employeeDao.findAll({
            $filter: {
                equals: {
                    OnboardingStatus: 1
                }
            }
        }).map(function (value) {
            return {
                value: value.Id,
                text: value.Name
            };
        });
    }

    @Post("/updateAssignee")
    public updateAssignee(body: any) {

        let task = this.onboardingTaskDao.findById(body.taskId);

        task.Assignee = body.assigneeId;

        this.onboardingTaskDao.update(task);

    }

}