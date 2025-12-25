/**
 * Assignment domain is responsbile for assigning a task to a user on 
 * certain fulfilling conditions.
 * 
 * 
 * assignment domain invariants:
 * A task can be assigned to only one user at a time.
 * A task can be assigned to a user only if the user is a member of the workspace.
 * A task can not be assigned to completed or deleted task.
 * A task can not be assigned to arhived project.
 * 
 */

import type { AssignmentProps } from "./assignment.type";
import EventAggregateRoot from '../../observability/domainEvent/eventAggregateRoot';

class AssignmentDomain extends EventAggregateRoot {
    private props: AssignmentProps;

    //guards for assignment domain to protect its invariants.

    //1. ensure the task is assignable : that is only those task in todo or in progress state.
    private ensureTaskAssignable(taskStatus: 'todo' | 'in_progress'): void {
        if (taskStatus !== 'todo' && taskStatus !== 'in_progress') {
            throw new Error('Task is not assignable');
        }
    }

    //2.Ensuring the project accepts assignment : that project is not arhived.
    //how the isArchived is determined?. handles this in application layer.
    private ensureProjectAcceptsAssignment(isArchived: boolean): void {
        if (isArchived) {
            throw new Error('Project does not accept assignment');
        }
    }

    //3. ensure user is a member of the workspace.
    //how the isMember is determined?. handles this in application layer.
    //we just need enough to protect the invariant.
    private ensureUserIsWorkspaceMember(isMember: boolean): void {
        if (!isMember) {
            throw new Error('User is not a member of the workspace');
        }
    }

    //ensure task is assigned to only one user at a time.
    private ensureNotAlreadyAssigned(): void {
        if (this.props.assigneeId) {
            throw new Error('Task is already assigned to a user');
        }
    }
    //this ensures the assignment is valid.
    constructor(props: AssignmentProps) {
        super();
        this.props = props;
    }

    //public methods to assign a task to a user
    public assign(userId: string, taskStatus: 'todo' | 'in_progress', isMemberofworkspace: boolean, isProjectArchived: boolean): void {
        this.ensureNotAlreadyAssigned();
        this.ensureTaskAssignable(taskStatus);
        this.ensureProjectAcceptsAssignment(isProjectArchived);
        this.ensureUserIsWorkspaceMember(isMemberofworkspace);
        this.props.assigneeId = userId;
        this.addEvent({
            type:'TASK_ASSIGNED',
            occuredAt:new Date(),
            metadata:{
              taskId:this.props.taskId,
            assigneeId:this.props.assigneeId,
          }
        })
    }
    public unassign(): void {
        if (!this.props.assigneeId) {
            throw new Error('Task is not assigned to any user');
        }
        this.addEvent({
            type:'TASK_UNASSIGNED',
            occuredAt:new Date(),
            metadata:{
              taskId:this.props.taskId,
              assigneeId:this.props.assigneeId,
            }
        })
        this.props.assigneeId = null;
    }

    //queries
    public isAssigneed(): string | null {
        return this.props.assigneeId;
    }
}

export default AssignmentDomain;