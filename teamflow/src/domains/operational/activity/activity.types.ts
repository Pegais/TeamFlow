/**
 * Activity is entity domain.
 * Well its nothing but immutable read only snapshot of a change
 */


export type ActivityProps = {
    id: string;
   actorId: string;
   action: string;
   workspaceId: string;
   targetId?:string;
   metadata :Record<string,any>;
   createdAt: Date;
   updatedAt: Date;

}