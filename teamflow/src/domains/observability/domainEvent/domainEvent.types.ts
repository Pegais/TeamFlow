/**
 * It is not an entiy.
 * Its a domain event.
 * It is immutable , track system domain level changes.
 * Important to notify dependant domains of what changed happened.
 * It has a source, a target, a type, a timestamp, and a payload.
 */


export type DomainEvent = {
    readonly type: string;
    readonly occuredAt: Date;
    readonly metadata?: Record<string, any>;
}

/**
 * | Domain     | Event            |
| ---------- | ---------------- |
| Task       | TASK_CREATED     |
| Task       | TASK_STARTED     |
| Task       | TASK_COMPLETED   |
| Project    | PROJECT_ARCHIVED |
| Workspace  | MEMBER_ADDED     |
| Membership | ROLE_CHANGED     |
| Assignment | TASK_ASSIGNED    |
| Comment    | COMMENT_ADDED    |

 */

















