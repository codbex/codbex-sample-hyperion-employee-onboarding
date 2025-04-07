import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface OnbboardingTaskEntity {
    readonly Id: number;
    Employee?: number;
    Name?: string;
    Assignee?: number;
    Status?: number;
    CompletedAt?: Date;
}

export interface OnbboardingTaskCreateEntity {
    readonly Employee?: number;
    readonly Name?: string;
    readonly Assignee?: number;
    readonly Status?: number;
    readonly CompletedAt?: Date;
}

export interface OnbboardingTaskUpdateEntity extends OnbboardingTaskCreateEntity {
    readonly Id: number;
}

export interface OnbboardingTaskEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Employee?: number | number[];
            Name?: string | string[];
            Assignee?: number | number[];
            Status?: number | number[];
            CompletedAt?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Employee?: number | number[];
            Name?: string | string[];
            Assignee?: number | number[];
            Status?: number | number[];
            CompletedAt?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Status?: number;
            CompletedAt?: Date;
        };
        greaterThan?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Status?: number;
            CompletedAt?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Status?: number;
            CompletedAt?: Date;
        };
        lessThan?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Status?: number;
            CompletedAt?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Employee?: number;
            Name?: string;
            Assignee?: number;
            Status?: number;
            CompletedAt?: Date;
        };
    },
    $select?: (keyof OnbboardingTaskEntity)[],
    $sort?: string | (keyof OnbboardingTaskEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OnbboardingTaskEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OnbboardingTaskEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OnbboardingTaskUpdateEntityEvent extends OnbboardingTaskEntityEvent {
    readonly previousEntity: OnbboardingTaskEntity;
}

export class OnbboardingTaskRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ONBBOARDINGTASK",
        properties: [
            {
                name: "Id",
                column: "ONBBOARDINGTASK_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Employee",
                column: "ONBBOARDINGTASK_EMPLOYEE",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "ONBBOARDINGTASK_NAME",
                type: "VARCHAR",
            },
            {
                name: "Assignee",
                column: "ONBBOARDINGTASK_ASSIGNEE",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "ONBBOARDINGTASK_STATUS",
                type: "INTEGER",
            },
            {
                name: "CompletedAt",
                column: "ONBBOARDINGTASK_COMPLETEDAT",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OnbboardingTaskRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OnbboardingTaskEntityOptions): OnbboardingTaskEntity[] {
        return this.dao.list(options).map((e: OnbboardingTaskEntity) => {
            EntityUtils.setDate(e, "CompletedAt");
            return e;
        });
    }

    public findById(id: number): OnbboardingTaskEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "CompletedAt");
        return entity ?? undefined;
    }

    public create(entity: OnbboardingTaskCreateEntity): number {
        EntityUtils.setLocalDate(entity, "CompletedAt");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ONBBOARDINGTASK",
            entity: entity,
            key: {
                name: "Id",
                column: "ONBBOARDINGTASK_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OnbboardingTaskUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "CompletedAt");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ONBBOARDINGTASK",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ONBBOARDINGTASK_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OnbboardingTaskCreateEntity | OnbboardingTaskUpdateEntity): number {
        const id = (entity as OnbboardingTaskUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OnbboardingTaskUpdateEntity);
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
            table: "CODBEX_ONBBOARDINGTASK",
            entity: entity,
            key: {
                name: "Id",
                column: "ONBBOARDINGTASK_ID",
                value: id
            }
        });
    }

    public count(options?: OnbboardingTaskEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ONBBOARDINGTASK"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OnbboardingTaskEntityEvent | OnbboardingTaskUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-sample-hyperion-employee-onboarding-OnboardingTask-OnbboardingTask", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-sample-hyperion-employee-onboarding-OnboardingTask-OnbboardingTask").send(JSON.stringify(data));
    }
}
