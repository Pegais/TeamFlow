

export  type TaskStatus = "todo" | "in_progress" | "completed" | "deleted";

export interface TaskProps {
    id: string;
    title: string;
    description?: string | undefined;
    status: TaskStatus;
    assigneeId?: string | undefined;
    updatedAt: Date | null  ;
    deletedAt: Date | null  ;
    createdAt: Date | null  ;

}