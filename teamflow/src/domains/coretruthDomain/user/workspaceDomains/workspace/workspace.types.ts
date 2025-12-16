//deciding the invariants:
// 1. A workspace has a name.
// 2. A workspace has a description.
// 3. A workspace has a creator.
// 4. A workspace has a createdAt date.
// 5. A workspace has a updatedAt date.
// 6. A workspace has a deletedAt date.
// 7. A workspace has a users with thier roles.
// 8. A workspace has a tasks.
// 9. A workspace has a projects.
//10. maximum number of users in a workspace is 20.
//11.minimum number of users in a workspace is 2.

//creating my domain interface for workspace.
interface User {
    id: string;
    name: string;
    email: string;
    updatedAt: Date;
    deletedAt: Date;
}

interface Task {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

//status can be active, inactive, deleted.
//active when team head or owner is present with teams but minmum size is 1.
//inactive if owner or team head is leaves.
//deleted if the workspace is deleted by the owner.
//i need workspace role :very important
export type WorkspaceRole = "owner" | "teamHead" | "member";

export interface workspaceMember {
  userId: string;
  role: "owner" | "teamHead" | "member";
}
export interface WorkspaceProps {
    id: string;
    name: string;
    description: string;
    members: workspaceMember[];
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | string;
    status: "active" | "inactive" | "deleted";
    userids: string[];
    taskids: string[];
    projectids: string[];
}