import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { OnboardingTaskRepository, OnboardingTaskEntityOptions } from "../../dao/OnboardingTask/OnboardingTaskRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-sample-hyperion-employee-onboarding-OnboardingTask-OnboardingTask", ["validate"]);

@Controller
class OnboardingTaskService {

    private readonly repository = new OnboardingTaskRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: OnboardingTaskEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-sample-hyperion-employee-onboarding/gen/codbex-sample-hyperion-employee-onboarding/api/OnboardingTask/OnboardingTaskService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("OnboardingTask not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("OnboardingTask not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Employee === null || entity.Employee === undefined) {
            throw new ValidationError(`The 'Employee' property is required, provide a valid value`);
        }
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 100) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [100] characters`);
        }
        if (entity.Description?.length > 500) {
            throw new ValidationError(`The 'Description' exceeds the maximum length of [500] characters`);
        }
        if (entity.Status === null || entity.Status === undefined) {
            throw new ValidationError(`The 'Status' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
