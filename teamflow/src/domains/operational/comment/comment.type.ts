/**
 * Comment is entity domain.
 * It is like a task in perspective of domains.
 * As it is either related to a task or a project.
 * Comment just know its existence with respect to task or project and an author.
 */


export type CommentProps={
    id:string;
    content:string | undefined;
    taskId?:string | null;
    projectId?:string | null;
    authorId:string | undefined;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date | null;
}