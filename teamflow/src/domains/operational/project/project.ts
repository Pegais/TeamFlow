/**
 * Project domain : Aggregate Root under workspace.
 * Why aggregate root ?: because project has its own lifecycle and it is dependent on workspace and its rule enforces on tasks.
 * 
 * its does not manage:
 * the users/authentication.
 * does not care who created the project.
 * it does not about the permissions.
 * 
 * 
 * Project invariants: its signle source of truth.
 * A project has a name.
 * A project must belong to atleast one workspace.
 * A project can be active/archieved/deleted.
 * A project can only be deleted (if no active tasks exists in the project)
 * A archieved project can not accept new task in new tasks.
 * A deleted project will not allow any operations on it.
 * 
 * 
 * allowed transitions :
 * active -> archieved
 * archieved->active
 * active->deleted(only if no active tasks )
 * archieved->deleted(only if no active tasks )
 * deleted -> teminate here;
 */

import type { ProjectProps, ProjectStatus } from "./project.types";
const { v4: uuidv4 } = require('uuid');
const EventAggregateRoot = require("../../../observability/domainEvent/eventAggregateRoot");

class ProjectDomain extends EventAggregateRoot {
    private props: ProjectProps



    //project guard rails;
    //check project name is not empty.
    private ensureNameNotEmpty(): void {
        if (!this.props.name || this.props.name.trim() === "") {
            throw new Error("Project name is required");
        }
    }
    //ensure project can only be deleted if no active tasks exists in the project.
    private ensureCanBeDeleted(hasActiveTasks: boolean): void {
        if (hasActiveTasks === true) {
            throw new Error("Project cannot be deleted as it contains active tasks");
        }
    }
    //ensure project is not deleted.
    private ensureNotDeleted(): void {
        if (this.props.status === "deleted") {
            throw new Error("Project is deleted");
        }
    }


    //ensure project belongs to atleast one workspace.
    private ensureProjectBelongsToWorkspace(): void {
        if (!this.props.workspaceId || this.props.workspaceId.trim() === "") {
            throw new Error("Project must belong to atleast one workspace");
        }
    }


    //ensure allowed transitions are followed.
    private ensureValidTransition(from: ProjectStatus, to: ProjectStatus): void {
        let allowedNextStates: ProjectStatus[] = [];
        //if active -> archieved-> deleted
        //if arhived-> active ->deleted
        if (from === "active") {
            allowedNextStates = ["archived", "deleted"];
        }
        if (from === "archived") {
            allowedNextStates = ["active", "deleted"];
        }
        if (from === "deleted") {
            allowedNextStates = [];
        }
        if (!allowedNextStates.includes(to)) {
            throw new Error(`Invalid transition from ${from} to ${to}`);
        }

    }

    //ensuring a archieved project can not accept new tasks.
    private ensureArchievedProjectCannotAcceptNewTasks(): void {
        if (this.props.status === "archived") {
            throw new Error("Archieved project cannot accept new tasks");
        }
    }
    constructor(props: ProjectProps) {
        super();
        this.props = props;
    }

    public static create(name: string, workspaceId: string): ProjectDomain {
        if (!name || name.trim() === "") {
            throw new Error("Project name is required");
        }
        if (!workspaceId || workspaceId.trim() === "") {
            throw new Error("Workspace ID is required");
        }
        const project= new ProjectDomain({
            id: uuidv4(),
            name,
            workspaceId,
            taskIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            status: "active",
        });
        project.addEvent({
            type: "PROJECT_CREATED",
            occuredAt: new Date(),
            projectId: project.props.id,
            workspaceId: project.props.workspaceId,
        })
        return project;
    }

    //renaminf a project :
    public rename(name: string): void {
        //ensure project is not deleted.
        this.ensureNotDeleted();
        if (!name || name.trim() === "") {
            throw new Error("Project name is required");
        }

        this.props.name = name;
        this.props.updatedAt = new Date();
        this.addEvent({
            type: "PROJECT_RENAMED",
            occuredAt: new Date(),
            projectId: this.props.id,
            workspaceId: this.props.workspaceId,
            newName: name,
        })


    }


    //archiving a project :
    public archive(): void {
        //ensure project is not deleted.
        this.ensureNotDeleted();

        //ensure allowed transitions are followed.
        this.ensureValidTransition(this.props.status, "archived");
        //update the status;
        this.props.status = "archived";
        this.props.updatedAt = new Date();
        this.addEvent({
            type: "PROJECT_ARCHIVED",
            occuredAt: new Date(),
            projectId: this.props.id,
            workspaceId: this.props.workspaceId,
         
        })
    }


    //restoring a project :
    public restore(): void {
       //ensure project is not deleted.
       this.ensureNotDeleted();

        //ensure allowed transitions are followed.
        this.ensureValidTransition(this.props.status, "active");
        //update the status;
        this.props.status = "active";
        this.props.updatedAt = new Date();
        this.addEvent({
            type: "PROJECT_RESTORED",
            occuredAt: new Date(),
            projectId: this.props.id,
            workspaceId: this.props.workspaceId,
        })

    }

    public delete(hasActiveTasks: boolean): void {
       
        //ensure project is not deleted.
        this.ensureNotDeleted();
        //ensure project can only be deleted if no active tasks exists in the project.
        this.ensureCanBeDeleted(hasActiveTasks);
        //ensure allowed transitions are followed.
        this.ensureValidTransition(this.props.status, "deleted");
        //update the status;
        this.props.status = "deleted";
        this.props.updatedAt = new Date();
        this.props.deletedAt = new Date();
        this.addEvent({
            type: "PROJECT_DELETED",
            occuredAt: new Date(),
            projectId: this.props.id,
            workspaceId: this.props.workspaceId,
        })
    }


    public add(taskid: string): void {
         //ensure project is not deleted.
         this.ensureNotDeleted();

        //enure the archived project can not accept new tasks.
        this.ensureArchievedProjectCannotAcceptNewTasks();
        //add the task to the project;
        this.props.taskIds.push(taskid);
        this.props.updatedAt = new Date();
        


    }
    public remove(taskid: string): void {
        //check if project is not deleted.
        this.ensureNotDeleted();

        //now removing the task from the project;
        this.props.taskIds = this.props.taskIds.filter(task => task !== taskid);
        this.props.updatedAt = new Date();
        

    }
}
module.exports = ProjectDomain;