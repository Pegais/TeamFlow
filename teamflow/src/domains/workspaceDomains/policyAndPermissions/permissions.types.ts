//creating my policy and permissions types.

export type WorkspaceAction =
  | "WORKSPACE_ADD_MEMBER"
  | "WORKSPACE_REMOVE_MEMBER"
  | "WORKSPACE_DELETE";

export type ProjectAction =
  | "PROJECT_CREATE"
  | "PROJECT_ARCHIVE"
  | "PROJECT_RESTORE"
  | "PROJECT_DELETE"
  | "PROJECT_ADD_TASK";

export type TaskAction =
  | "TASK_CREATE"
  | "TASK_START"
  | "TASK_COMPLETE"
  | "TASK_DELETE";
