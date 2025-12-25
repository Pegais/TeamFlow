/**
 * Before designing event subscribers, we need to understand the event-driven architecture.
 * 
 * lets understand our event occuring in different domains which are handled by,
 * eventAggregateRoot class.
 * 
 * 
 * Task domain events : 
 * TASK_CREATED
 * TASK_STARTED
 * TASK_COMPLETED
 * 
 * Project domain events :
 * PROJECT_CREATED
 * PROJECT_RESTORED
 * PROJECT_DELETED
 * PROJECT_ARCHIVED
 * 
 * Workspace domain events :
 * WORKSPACE_MEMBER_ADDED
 * WORKSPACE_MEMBER_REMOVED
 * WORKSPACE_DELETED
 * 
 * 
 * Comment domain events :
 * COMMENT_CREATED
 * COMMENT_UPDATED
 * COMMENT_DELETED
 * 
 * Assignment domain events :
 * TASK_ASSIGNED
 * TASK_UNASSIGNED
 * 
 * 
 * */


/**
 * Desiging the event subscribers for workspace domain events :
 * 
 * Activity/audit logs 
 * notification (affected members and owners)
 * Projections :workspacce membershipo view
 */

/**
 * Designing the event subscriber for project domain events :
 * activity/audit logs
 * Notifications (optional : to owners and team heads)
 * Projections : update task read models (status ,archieve /delete flags)
 * 
 * 
 * 
 * Designing the event subscriber for task domain events :
 * activity/audit logs
 * Notifications (optional : to assignees and author)
 * Projections : update task read models (status ,timestamps)
 * 
 * 
 * 
 * Designing the event subscriber for comment domain events :
 * activity/audit logs
 * Notifications (optional : to task  and project participants)
 * projections: comment read models 
 * 
 * 
 * Assignment domain events :
 * activity/audit logs
 * Notifications (optional : to assignees)
 * Projections : update task assignment view
 * 
 * 
 * invitation domain events :
 * activity/audit logs
 * Notifications (optional : to invitees/owners)
 * Projections : update invitation read models
 * 
 * Notification domain events :(later)
 * activity/audit logs
 * projections : notification read models
 * 
 */
import eventBus from '../../domains/observability/domainEvent/eventBus';
import type { DomainEvent } from '../../domains/observability/domainEvent/domainEvent.types';

const handlers = {
    activityLogs: async (event: DomainEvent) => {

        //todo : persist to activity /audit store;
        //activityRepository.save(event);

    },
    notify: async (event: DomainEvent) => {
        //TODO:send notifications /enqueue
        //notificationService.send(event);
    },
    projectProjections:     async (event: DomainEvent) => {
        //TODO:update project read models (status ,archieve /delete flags)
        //projectRepository.update(event);
    },
    taskProjections: async (event: DomainEvent) => {
        //TODO:update task read models (status ,timestamps)
        //taskRepository.update(event);
    },
    commentProjections: async (event: DomainEvent) => {
        //TODO:update comment read models
        //commentRepository.update(event);
    },

    invitationProjections: async (event: DomainEvent) => {
        //TODO:update invitation read models
        //invitationRepository.update(event);
    },
    workspaceProjections:   async (event: DomainEvent) => {
        //TODO:update workspace read models
        //workspaceRepository.update(event);
    },
}


//subscription registration :
function registerSubscribers() {
    const on = (type: string, handler: (event: DomainEvent) => Promise<void>) => {
        eventBus.subscribe(type, handler);
    }

    //task domain events :
    ['TASK_CREATED', 'TASK_STARTED', 'TASK_COMPLETED'].forEach(t => {
        on(t, handlers.activityLogs);
        on(t, handlers.taskProjections);
        on(t, handlers.notify);
    });

    //project domain events :
    ['PROJECT_CREATED', 'PROJECT_RESTORED', 'PROJECT_DELETED', 'PROJECT_ARCHIVED','PROJECT_RENAMED','TASK_ADDED_TO_PROJECT','TASK_REMOVED_FROM_PROJECT'].forEach(p => {
        on(p, handlers.activityLogs);
        on(p, handlers.projectProjections);
        on(p, handlers.notify);
    });

    //workspace domain events :
    ['WORKSPACE_MEMBER_ADDED', 'WORKSPACE_MEMBER_REMOVED', 'WORKSPACE_DELETED'].forEach(w => {
        on(w, handlers.activityLogs);
        on(w, handlers.workspaceProjections);
        on(w, handlers.notify);
    });

    //comment domain events :
    ['COMMENT_CREATED', 'COMMENT_UPDATED', 'COMMENT_DELETED'].forEach(c => {
        on(c, handlers.activityLogs);
        on(c, handlers.commentProjections);
        on(c, handlers.notify);

    });

    //Assignment domain events :
    ['TASK_ASSIGNED', 'TASK_UNASSIGNED'].forEach(a => {
        on(a, handlers.activityLogs);
        on(a, handlers.taskProjections);
        on(a, handlers.notify);
    });

    //invitation domain events :
    ['INVITATION_CREATED', 'INVITATION_ACCEPTED','INVITATION_REVOKED','INVITATION_EXPIRED'].forEach(i => {
        on(i, handlers.activityLogs);
        on(i, handlers.invitationProjections);
        on(i, handlers.notify);
    });

}

export default registerSubscribers;