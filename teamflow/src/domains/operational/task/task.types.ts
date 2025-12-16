

export  type TaskStatus = "todo" | "in_progress" | "completed" | "deleted";

export interface TaskProps {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assigneeId?: string;
    updatedAt: Date | null ;
    deletedAt: Date | null ;
    createdAt: Date | null ;

}