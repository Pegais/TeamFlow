export type AuditAction =
  | "WORKSPACE_CREATED"
  | "WORKSPACE_DELETED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_CHANGED"
  | "PROJECT_CREATED"
  | "PROJECT_ARCHIVED"
  | "PROJECT_RESTORED"
  | "PROJECT_DELETED"
  | "TASK_CREATED"
  | "TASK_STARTED"
  | "TASK_COMPLETED";


  export interface AuditProps{
    id:string;
    action:AuditAction;  //what happened?
    
    actorId:string; //who did it?
    createdAt:Date; //when it happened?
    workspaceId:string; //which workspace it happened in?
    targetId?:string; //which target it happened to?
    metadata?:Record<string, any>; //additional information about the audit

  }