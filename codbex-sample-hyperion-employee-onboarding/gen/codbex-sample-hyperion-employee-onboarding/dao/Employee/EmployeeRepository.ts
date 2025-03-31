import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface EmployeeEntity {
    readonly Id: number;
    Name?: string;
    Email?: string;
    Department?: number;
    StartDate?: Date;
    OnboardingStatus?: number;
}

export interface EmployeeCreateEntity {
    readonly Name?: string;
    readonly Email?: string;
    readonly Department?: number;
    readonly StartDate?: Date;
    readonly OnboardingStatus?: number;
}

export interface EmployeeUpdateEntity extends EmployeeCreateEntity {
    readonly Id: number;
}

export interface EmployeeEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Email?: string | string[];
            Department?: number | number[];
            StartDate?: Date | Date[];
            OnboardingStatus?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Email?: string | string[];
            Department?: number | number[];
            StartDate?: Date | Date[];
            OnboardingStatus?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Email?: string;
            Department?: number;
            StartDate?: Date;
            OnboardingStatus?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Email?: string;
            Department?: number;
            StartDate?: Date;
            OnboardingStatus?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Email?: string;
            Department?: number;
            StartDate?: Date;
            OnboardingStatus?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Email?: string;
            Department?: number;
            StartDate?: Date;
            OnboardingStatus?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Email?: string;
            Department?: number;
            StartDate?: Date;
            OnboardingStatus?: number;
        };
    },
    $select?: (keyof EmployeeEntity)[],
    $sort?: string | (keyof EmployeeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface EmployeeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<EmployeeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface EmployeeUpdateEntityEvent extends EmployeeEntityEvent {
    readonly previousEntity: EmployeeEntity;
}

export class EmployeeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_EMPLOYEE",
        properties: [
            {
                name: "Id",
                column: "EMPLOYEE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "EMPLOYEE_NAME",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "EMPLOYEE_EMAIL",
                type: "VARCHAR",
            },
            {
                name: "Department",
                column: "EMPLOYEE_DEPARTMENT",
                type: "INTEGER",
            },
            {
                name: "StartDate",
                column: "EMPLOYEE_STARTDATE",
                type: "DATE",
            },
            {
                name: "OnboardingStatus",
                column: "EMPLOYEE_ONBOARDINGSTATUS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(EmployeeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: EmployeeEntityOptions): EmployeeEntity[] {
        return this.dao.list(options).map((e: EmployeeEntity) => {
            EntityUtils.setDate(e, "StartDate");
            return e;
        });
    }

    public findById(id: number): EmployeeEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "StartDate");
        return entity ?? undefined;
    }

    public create(entity: EmployeeCreateEntity): number {
        EntityUtils.setLocalDate(entity, "StartDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_EMPLOYEE",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: EmployeeUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "StartDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_EMPLOYEE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "EMPLOYEE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: EmployeeCreateEntity | EmployeeUpdateEntity): number {
        const id = (entity as EmployeeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as EmployeeUpdateEntity);
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
            table: "CODBEX_EMPLOYEE",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEE_ID",
                value: id
            }
        });
    }

    public count(options?: EmployeeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_EMPLOYEE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: EmployeeEntityEvent | EmployeeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-sample-hyperion-employee-onboarding-Employee-Employee", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-sample-hyperion-employee-onboarding-Employee-Employee").send(JSON.stringify(data));
    }
}
