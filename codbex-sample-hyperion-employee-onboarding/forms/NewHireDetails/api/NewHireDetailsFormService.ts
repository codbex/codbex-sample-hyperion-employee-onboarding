import { EmployeeRepository as EmployeeDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Employee/EmployeeRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/dao/Department/DepartmentRepository";

import { Controller, Get, Post, response } from "sdk/http";

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
        } catch (e: any) {
            response.setStatus(response.BAD_REQUEST);
            return { error: e.message };
        }
    }

}