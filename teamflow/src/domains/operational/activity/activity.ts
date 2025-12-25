/**
 * Actiivity is immutable read only snapshot of a change.
 * 
 * There is no lifecycle,no checks, validation.
 * Just a snapshot of a change from and where.
 */

import type { ActivityProps } from "./activity.types";
class ActivityDomain {
    private props: ActivityProps;
    constructor(props: ActivityProps) {
        this.props = props;
    }

    //static factory  from audit/events:
    public static fromAudit(audit: {
        id: string;
        actorId: string;
        action: string;
        workspaceId: string;
        targetId?: string;
        metadata: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;

    }): ActivityDomain {
        return new ActivityDomain({
            id: audit.id,
            actorId: audit.actorId,
            action: audit.action,
            workspaceId: audit.workspaceId,
            ...(audit.targetId && { targetId: audit.targetId }),
            metadata: audit.metadata,
            createdAt: audit.createdAt,
            updatedAt: audit.updatedAt,
        });
    }

    //Queries only :
    public get data():ActivityProps{
        return this.props;
    }
}

export default ActivityDomain;