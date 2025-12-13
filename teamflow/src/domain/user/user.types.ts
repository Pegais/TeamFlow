export type UserStatus = "active" | "suspended" | "deleted";

export interface UserProps {
    id: string;
    email: string;
    name: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | string;
}