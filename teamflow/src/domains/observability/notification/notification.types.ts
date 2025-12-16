export type NotificationStatus = "read" | "unread";


export type NotificationProps = {
    id: string;
    recipientId: string;
    type: string;
    message: string;
    createdAt: Date;
    readAt?: Date | null;
}