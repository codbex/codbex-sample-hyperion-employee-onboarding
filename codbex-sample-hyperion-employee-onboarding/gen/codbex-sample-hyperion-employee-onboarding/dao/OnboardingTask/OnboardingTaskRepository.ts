import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface OnboardingTaskEntity {
    readonly Id: number;
    Employee?: number;
    Name?: string;
    Assignee?: number;
    Description?: string;
    Status?: number;
    CompletedAt?: Date;
}

export interface OnboardingTaskCreateEntity {
    readonly Employee?: number;
    readonly Name?: string;
    readonly Assignee?: number;
    readonly Description?: string;
    readonly Status?: number;
    readonly CompletedAt?: Date;
}

export interface OnboardingTaskUpdateEntity extends OnboardingTaskCreateEntity {
    readonly Id: number;
}

export interface OnboardingTaskEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Employee?: number | number[];
            Name?: string | string[];
            Assignee?: number | number[];
            Description?: string | string[];
            Status?: number | number[];
            CompletedAt?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Employee?: number | number[];
            Name?: string | string[];
            Assignee?: number | number[];
            Description?: string | string[];
            Status?: number | number[];
            CompletedAt?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Description?: string;
            Status?: number;
            CompletedAt?: Date;
        };
        greaterThan?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Description?: string;
            Status?: number;
            CompletedAt?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Description?: string;
            Status?: number;
            CompletedAt?: Date;
        };
        lessThan?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Description?: string;
            Status?: number;
            CompletedAt?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Description?: string;
            Status?: number;
            CompletedAt?: Date;
        };
    },
    $select?: (keyof OnboardingTaskEntity)[],
    $sort?: string | (keyof OnboardingTaskEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface OnboardingTaskEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OnboardingTaskEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OnboardingTaskUpdateEntityEvent extends OnboardingTaskEntityEvent {
    readonly previousEntity: OnboardingTaskEntity;
}

export class OnboardingTaskRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ONBOARDINGTASK",
        properties: [
            {
                name: "Id",
                column: "ONBOARDINGTASK_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Employee",
                column: "ONBOARDINGTASK_EMPLOYEE",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "ONBOARDINGTASK_NAME",
                type: "VARCHAR",
            },
            {
                name: "Assignee",
                column: "ONBOARDINGTASK_ASSIGNEE",
                type: "INTEGER",
            },
            {
                name: "Description",
                column: "ONBOARDINGTASK_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Status",
                column: "ONBOARDINGTASK_STATUS",
                type: "INTEGER",
            },
            {
                name: "CompletedAt",
                column: "ONBOARDINGTASK_COMPLETEDAT",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OnboardingTaskRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: OnboardingTaskEntityOptions = {}): OnboardingTaskEntity[] {
        return this.dao.list(options).map((e: OnboardingTaskEntity) => {
            EntityUtils.setDate(e, "CompletedAt");
            return e;
        });
    }

    public findById(id: number): OnboardingTaskEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "CompletedAt");
        return entity ?? undefined;
    }

    public create(entity: OnboardingTaskCreateEntity): number {
        EntityUtils.setLocalDate(entity, "CompletedAt");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ONBOARDINGTASK",
            entity: entity,
            key: {
                name: "Id",
                column: "ONBOARDINGTASK_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OnboardingTaskUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "CompletedAt");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ONBOARDINGTASK",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ONBOARDINGTASK_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OnboardingTaskCreateEntity | OnboardingTaskUpdateEntity): number {
        const id = (entity as OnboardingTaskUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OnboardingTaskUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_ONBOARDINGTASK",
            entity: entity,
            key: {
                name: "Id",
                column: "ONBOARDINGTASK_ID",
                value: id
            }
        });
    }

    public count(options?: OnboardingTaskEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ONBOARDINGTASK"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OnboardingTaskEntityEvent | OnboardingTaskUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-sample-hyperion-employee-onboarding-OnboardingTask-OnboardingTask", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-sample-hyperion-employee-onboarding-OnboardingTask-OnboardingTask").send(JSON.stringify(data));
    }
}
