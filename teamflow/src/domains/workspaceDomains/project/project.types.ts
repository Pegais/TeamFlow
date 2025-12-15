export type ProjectStatus = "active" | "archived" | "deleted";



export interface ProjectProps {
        id: string;
        name: string;
        description?: string;
        workspaceId: string;
        taskIds: string[];
        createdAt: Date |null;
        updatedAt: Date |null;
        deletedAt: Date |null;
        status: ProjectStatus;
}