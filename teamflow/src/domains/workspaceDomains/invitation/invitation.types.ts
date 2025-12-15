import type workspaceTypes = require("../workspace/workspace.types");


export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";


export interface InvitationProps {
    id: string;
    email: string;
    role: workspaceTypes.WorkspaceRole;
    workspaceId: string;
    status: InvitationStatus;
    expiresAt: Date ;
    acceptedAt: Date ;
    revokedAt: Date ;
}