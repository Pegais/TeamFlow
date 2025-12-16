// This domain is about:
/**
 * Business logic involved in invitation for our aggregate root workspace or projects.
 */

import type { InvitationProps } from "./invitation.types";
import type workspaceTypes = require("../../coretruthDomain/user/workspaceDomains/workspace/workspace.types");
import type { InvitationStatus } from "./invitation.types";

class InvitationDomain {
    private props: InvitationProps;


    //guards for the domain:
    //ensuring the invitation is pending:
    private ensurePending(): void {
        if (this.props.status !== "pending") {
            throw new Error("Invitation is not pending");
        }
    }

    //ensuring the invitation is not expired:
    private ensureNotExpired(): void {
        if (this.props.expiresAt <=new Date()) {
            throw new Error("Invitation has expired");
        }
    }


    constructor(props: InvitationProps) {
        this.props = props;
    }


    //public methods:
    public accept(): void {
        //make sure the invitation is pending and not expired:
        this.ensurePending();
        this.ensureNotExpired();
        //update the status to accepted:
        this.props.status = "accepted";
        this.props.acceptedAt = new Date();
    }

    //revoking the invitation:
    public revoke(): void {
        //make sure the invitation is pending and not expired:
        //NOTE : revoking is manual not time driven.
        this.ensurePending();
      
        //update the status to revoked:
        this.props.status = "revoked";
        this.props.revokedAt = new Date();
    }

    //expired invitation:
    public expire(): void {
        //make sure the invitation is pending and not expired:
        //expiration is time driven.
        //and should be idempotent/
    if(this.props.status !== "pending") return;
    if(this.props.expiresAt > new Date()) return; //the duration is not over yet.
      
        //update the status to expired:
        this.props.status = "expired";
   
    }

    //queries
    public isValid(): boolean {
        if (this.props.status === "pending" && this.props.expiresAt && this.props.expiresAt > new Date()) {
            return true;
        }
        return false;
    }
}

module.exports = InvitationDomain;