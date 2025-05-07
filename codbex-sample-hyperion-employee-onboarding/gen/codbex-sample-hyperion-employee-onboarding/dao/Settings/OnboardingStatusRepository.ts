import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OnboardingStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface OnboardingStatusCreateEntity {
    readonly Name?: string;
}

export interface OnboardingStatusUpdateEntity extends OnboardingStatusCreateEntity {
    readonly Id: number;
}

export interface OnboardingStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof OnboardingStatusEntity)[],
    $sort?: string | (keyof OnboardingStatusEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface OnboardingStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OnboardingStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OnboardingStatusUpdateEntityEvent extends OnboardingStatusEntityEvent {
    readonly previousEntity: OnboardingStatusEntity;
}

export class OnboardingStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ONBOARDINGSTATUS",
        properties: [
            {
                name: "Id",
                column: "ONBOARDINGSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "ONBOARDINGSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OnboardingStatusRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: OnboardingStatusEntityOptions = {}): OnboardingStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OnboardingStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OnboardingStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ONBOARDINGSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ONBOARDINGSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OnboardingStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ONBOARDINGSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ONBOARDINGSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OnboardingStatusCreateEntity | OnboardingStatusUpdateEntity): number {
        const id = (entity as OnboardingStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OnboardingStatusUpdateEntity);
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
            table: "CODBEX_ONBOARDINGSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ONBOARDINGSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: OnboardingStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ONBOARDINGSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OnboardingStatusEntityEvent | OnboardingStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-sample-hyperion-employee-onboarding-Settings-OnboardingStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-sample-hyperion-employee-onboarding-Settings-OnboardingStatus").send(JSON.stringify(data));
    }
}
