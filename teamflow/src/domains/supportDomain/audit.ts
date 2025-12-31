/**
 * Audit Domain is support Domain:
 * It is not an aggregate root domain.
 * It is not an entity domain.
 * it is just a support domain for the other domains for:
 * montioring changes , how : action->context->actor .
 * it is immutable , append only.
 */


/**
 * Working on the Audit invariants(its source of truth):
 * 1. An audit has an action.
 * 2. An audit has a context.
 * 3. An audit has an actor.
 * 4. An audit has a timestamp.
 * 5 An audit can not be changed or modified.
 
 */

import { v4 as uuidv4 } from "uuid";
import type { AuditProps, AuditAction } from "./audit.types";

class AuditDomain {
    private props: AuditProps;

    //no guards required.
    //no state transitions required.
    //no lifecycle management.

    //just immutable append only entry.
    constructor(props: AuditProps) {
        this.props = props;
    }

    //methods :
    public static record(
    
        action: AuditAction,
        actorId: string,
        workspaceId: string,
        targetId?: string,
        metadata?: Record<string, any>,//Record is a utility type to create a dictionary of key value pairs.
    ): AuditDomain {
        return new AuditDomain({
            id:uuidv4(),
            action,
            actorId,
            workspaceId,
            createdAt: new Date(),
            ...(targetId && { targetId }),
            ...(metadata && { metadata }),
        })
    }

    //queries:
    public get data():AuditProps{
        return this.props;
    }
}




