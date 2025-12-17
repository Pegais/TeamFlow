// This domain is about:
/**
 * Business logic involved in invitation for our aggregate root workspace or projects.
 */

import type { InvitationProps } from "./invitation.types";
import type workspaceTypes = require("../../coretruthDomain/user/workspaceDomains/workspace/workspace.types");
import type { InvitationStatus } from "./invitation.types";
const EventAggregateRoot = require("../../../observability/domainEvent/eventAggregateRoot");

class InvitationDomain extends EventAggregateRoot {
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
        super();
        this.props = props;
    }

  //static factory :
  public static create(props: InvitationProps):InvitationDomain{
    const invitation = new InvitationDomain({
        ...props,
        status: "pending",
        createdAt: new Date(),
    });
    invitation.addEvent({
        type: "INVITATION_CREATED",
        occuredAt: new Date(),
        invitationId: invitation.props.id,
        workspaceId: invitation.props.workspaceId,
        email: invitation.props.email,
        role: invitation.props.role,
    });
    return invitation;
  }
    //public methods:
    public accept(): void {
        //make sure the invitation is pending and not expired:
        this.ensurePending();
        this.ensureNotExpired();
        //update the status to accepted:
        this.props.status = "accepted";
        this.props.acceptedAt = new Date();
        this.addEvent({
            type: "INVITATION_ACCEPTED",
            occuredAt: new Date(),
            invitationId: this.props.id,
            workspaceId: this.props.workspaceId,
            email: this.props.email,
            role: this.props.role,
        });
    }

    //revoking the invitation:
    public revoke(): void {
        //make sure the invitation is pending and not expired:
        //NOTE : revoking is manual not time driven.
        this.ensurePending();
      
        //update the status to revoked:
        this.props.status = "revoked";
        this.props.revokedAt = new Date();
        this.addEvent({
            type: "INVITATION_REVOKED",
            occuredAt: new Date(),
            invitationId: this.props.id,
            workspaceId: this.props.workspaceId,
            email: this.props.email,
            role: this.props.role,
        });
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
        this.addEvent({
            type: "INVITATION_EXPIRED",
            occuredAt: new Date(),
            invitationId: this.props.id,
            workspaceId: this.props.workspaceId,
            email: this.props.email,
            role: this.props.role,
        });
   
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