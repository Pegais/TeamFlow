import type { WorkspaceProps } from "./workspace.types";
const {v4: uuidv4} = require('uuid');
import type { WorkspaceRole, workspaceMember} from "./workspace.types";
//creating a workspace class :
//deciding the operations :
//1. we can create a workspace.
//2.we can add user to workspace only when the my role is owner or team head.
//3.we can remove user from workspace only when the my role is owner or team head.
//4.we can add user to workspace only when the user is not already in the workspace and limit is not reached.
//5.anyone can update the workspace name and description.
//6.can delete the workspace only when the my role is owner.
//we can create and add task to workspace (anyone).
//assiging the task to user only owner or team head.

//what should not be allowed in this domain :
//1.cannot add user to workspace if the limit is reached.
//2. cannot remove or delete task if it is assigned to a user.
//3. cannot delete workspace if it has tasks assigned to it.
class WorkspaceDomain{
    private props:WorkspaceProps

    //main helper to guard the owner :actual key to workspace.
    //helper checks for owner
    private hasatleastOneOwner():boolean{
        return this.props.members.some(member => member.role === "owner");
    }

    //guards
    //guard 1 : ensure workspace is not deleted.
    private ensureNotDeleted():void{
      if(this.props.status === "deleted"){
        throw new Error("Workspace is deleted and cannot be modified");
      }
    }

     // guard2 :ensure at least one owner is present.
     //guard are used for enforcing invariants.
     private esureOneOwnerExists():void{
        if(!this.hasatleastOneOwner()){
            throw new Error("Workspace must have at least one owner");
        }
     }

     //guard3 : ensure members exists for removal
     private ensureMemberExists(userId:string):void{
     if(!this.props.members.some(member => member.userId === userId)){
        throw new Error("Member does not exist in the workspace");
     }
     }

     //guard 4: ensure owner is their for descturctive actions.
     private ensureCallerIsOwner(callerId:string):void{
       const caller = this.props.members.find(member => member.userId === callerId);
       if(!caller || caller.role !== "owner"){
        throw new Error("Only Owner can perform this action");
       }
     }

     //guard 5: ensrue workspace team capactiy is not exceeded.
     private ensureTeamCapacity():void{
       if(this.props.members.length >= 20){
        throw new Error("Workspace team capacity exceeded");
       }
     }
     
    constructor(props:WorkspaceProps){
        this.props=props;
    }

 
}