/**
 * Membership domain is about:
 * no an entity domain.
 * not an aggregate root domain.
 * just pure logic of role management.
 */


import type { MembershipProps } from "./membership.types";
import type { WorkspaceRole } from "../../coretruthDomain/user/workspaceDomains/workspace/workspace.types";
class MembershipDomain {
    private props: MembershipProps;

    //working on the guards:


    //ensuring that the owner is not the last owner in the workspace;
    //we dont track how we got the total owners:
    //just identifying if the owner is the last owner in the workspace;
    private ensureNotLastOwner(totalOwners: number) {
        if (totalOwners === 1) {
            throw new Error("Cannot remove the last owner from the workspace");
        }
    }

    //ensuring valid role change;
    //defining the valid role changes:
    //for our application we will not allow owner to become member or teamHead or changing the owner status by other owners.
    /**
     * member-> teamHead or owner
     * teamHead-> owner or member
     * 
     */

    private ensureValidRoleChange(from: WorkspaceRole, to: WorkspaceRole) {
        let allowedNextRoles: WorkspaceRole[] = [];
        if (from === "member") {
            allowedNextRoles = ["teamHead", "owner"];
        }
        if (from === "teamHead") {
            allowedNextRoles = ["owner", "member"];
        }
        if (from === "owner") {
            allowedNextRoles = [];
        }
        if (!allowedNextRoles.includes(to)) {
            throw new Error(`Invalid role change from ${from} to ${to}`);
        }
    }


    //this constructor state makes sure that the props are in valid state.
    constructor(props: MembershipProps) {
        this.props = props;
    }

    //since our prop state is valid, we just define methods on this valid state :

    public changeRole(newRole:WorkspaceRole){
        //first we need to ensure that the new role transition is valid;
        this.ensureValidRoleChange(this.props.role, newRole);

  
      
        //then we can update the role;
        this.props.role = newRole;
    }


    //check is it is owner;
    public isOwner():boolean{
        return this.props.role === "owner";
    }

    //check is it is teamHead;
    public isTeamHead():boolean{
        return this.props.role === "teamHead" ;
    }

    //check is it is member;
    public isMember():boolean{
        return this.props.role === "member";
    }
}
module.exports = MembershipDomain;