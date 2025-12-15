/**
 * Poilcy and permissions domain :
 * Very different from other domains.
 * It is not an aggregate root.
 * It is not a entity.
 * It is a policy and permissions domain.
 * It is a domain that is used to manage the policies and permissions for the application.
 */

/**
 * Core working model
 * Actors : who can do what. (userid ,role);
 * Context:where (workspace,task,projects);
 * Action: what (create,read,update,delete);
 * 
 * Outpur: either true or throw error.
 */
import type { WorkspaceAction, ProjectAction, TaskAction } from "./permissions.types";
import type { WorkspaceRole } from "../workspace/workspace.types";

//now defining the action for our permission domain.
type Action = WorkspaceAction | ProjectAction | TaskAction;

class PermissionPolicu {
    //defining workspace level policies:
    static canPerformWorkspaceAction(
        role: WorkspaceRole,
        action: WorkspaceAction,
    ): boolean {
        switch (action) {
            case "WORKSPACE_ADD_MEMBER":
            case "WORKSPACE_REMOVE_MEMBER":
                return role === "owner";

            case "WORKSPACE_DELETE":
                return role === "owner";
            default:
                return false;
        }
    }

    //defining project level policies:
    static canPerformProjectAction(
        action: ProjectAction,
        role: WorkspaceRole,
    ): boolean {
        switch (action) {
            case "PROJECT_CREATE":
                return role === "owner" || role === "teamHead";
            case "PROJECT_ARCHIVE":
            case "PROJECT_RESTORE":
                return role === "owner" || role === "teamHead";
            case "PROJECT_DELETE":
                return role === "owner";
            case "PROJECT_ADD_TASK":
                return role !== "member";
            default:
                return false;
        }
    }

    //defining task level policies:
    static canPerformTaskAction(
        action:TaskAction,
        role:WorkspaceRole,
    ):boolean{
        switch(action){
            case "TASK_CREATE":
            case "TASK_START":
            case "TASK_COMPLETE":
                return role !== "member";
            case "TASK_DELETE":
                return role==="owner";
            default:
                return false;
        }
    }


}