import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Department/DepartmentRepository";

import { Controller, Get, Post, response, request } from "sdk/http";
import { process } from "sdk/bpm";
import { user } from "sdk/security";

@Controller
class NewHireDetailsFormService {

    private readonly employeeDao;
    private readonly departmentDao;

    constructor() {
        this.employeeDao = new EmployeeDao();
        this.departmentDao = new DepartmentDao();
    }

    @Get("/departmentData")
    public departmentData() {
        return this.departmentDao.findAll().map(function (value) {
            return {
                value: value.Id,
                text: value.Name
            };
        });
    }

    @Post("/createEmployee")
    public createEmployee(body: any) {

        try {
            ["Name", "Email", "Department", "StartDate"].forEach(elem => {
                if (!body.hasOwnProperty(elem)) {
                    response.setStatus(response.BAD_REQUEST);
                    return;
                }
            })

            const newEmployee = this.employeeDao.create(body);

            if (!newEmployee) {
                response.setStatus(500);
                return { message: "Failed to create Employee!" };
            }

            this.startProcess(newEmployee);

            response.setStatus(response.CREATED);
            return { message: "Employee created!" };
        } catch (e: any) {
            response.setStatus(response.BAD_REQUEST);
            return { error: e.message };
        }
    }

    private startProcess(employeeId: number) {
        const users = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Email: user.getName()
                }
            }
        });

        const protocol = request.getScheme() + "://";
        const domain = request.getHeader("Host")

        const taskLink = `${protocol}${domain}/services/web/codbex-sample-hyperion-employee-onboarding/forms/TaskCompletion/task-completion-form.html?employeeId=${employeeId}`;
        const managerLink = `${protocol}${domain}/services/web/codbex-sample-hyperion-employee-onboarding/forms/ManagerReview/manager-review-form.html?employeeId=${employeeId}`;
        const onboardingInitiatorLink = `${protocol}${domain}/services/web/codbex-sample-hyperion-employee-onboarding/forms/HRConfirmation/hr-confirmation-form.html?employeeId=${employeeId}`

        const processInstanceId = process.start("onboarding-process", {
            Employee: employeeId,
            TaskLink: taskLink,
            Manager: 1, // TODO: Ask how the initial manager shoul be choosen
            ManagerLink: managerLink,
            OnboardingInitiator: users[0].Id,
            OnboardingInitiatorLink: onboardingInitiatorLink
        });

        if (!processInstanceId) {
            throw new Error("Failed to start onboarding process!");
        }
    }

}