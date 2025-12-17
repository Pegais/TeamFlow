import type { WorkspaceProps } from "./workspace.types";
const {v4: uuidv4} = require('uuid');
import type { WorkspaceRole, workspaceMember} from "./workspace.types";
const EventAggregateRoot = require("../../../../observability/domainEvent/eventAggregateRoot");

// REMEMBER:
// Your Workspace domain:

// Owns: members, status, lifecycle

// Does NOT own: task internals (status, completion logic)






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
class WorkspaceDomain extends EventAggregateRoot{
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
     //this guard is used for checking owner beforer a operations not after it.
     private ensureOwnerExists():void{
        if(!this.hasatleastOneOwner()){
            throw new Error("Workspace must have at least one owner");
        }
     }

     //owner guard after a operation to check if the last owner is removed.
     private ensureNotRemovingLastOwner(userId:string):void{
        const member = this.props.members.find(m => m.userId === userId);
        if (!member) return; // existence is checked elsewhere
      
        if (member.role !== "owner") return;

        //why this apporach;
        //it allows deletion of the other memebers and only last owner is not allowed to be removed.
      
        const ownerCount = this.props.members.filter(m => m.role === "owner").length;
      
        if (ownerCount === 1) {
          throw new Error("Cannot remove the last owner from the workspace");
        }

     }
     //guard3 : ensure members exists for removal
     //userful for removal and updating of the member.
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
     private ensureCapacityAvailable():void{
       if(this.props.members.length >= 20){
        throw new Error("Workspace team capacity exceeded");
       }
     }

     //guard 6: ensure member does not exist in the workspace.
     //useful for addition of the member.
     private ensureMemberDoesNotExist(userId:string):void{
        const memberPresent = this.props.members.some(member => member.userId === userId);
        if(memberPresent){
           throw new Error("Member already exists in the workspace");
        }
     }

     //guard 7: ensure workspace task status is not active or in progress.
   private ensureNoActiveTasks(hasActiveTasks:boolean):void{
     //how will i know task status is active or in progress;
     //it does not matter as this domain does not handle task status.
     if(hasActiveTasks===true){
        throw new Error("Workspace has active or in progress tasks and cannot be deleted");
     }
   }
     
    constructor(props:WorkspaceProps){
        super();
        this.props=props;
    }
    
    //creating pulbic methods:
    public addMember(creatorId:string,userId:string,role:WorkspaceRole):void{
        //before adding memeber we check for the following:
        //1.ensure workspace is not deleted.
        //2.ensure creator is owner.(Authorization check first...)
        //3.ensure owner exists.
        //4ensure team capacity is not exceeded.
        //ensure member does not exist.
        this.ensureNotDeleted();
        this.ensureCallerIsOwner(creatorId);
        this.ensureOwnerExists();
        this.ensureCapacityAvailable();
        this.ensureMemberDoesNotExist(userId);
        this.props.members.push({userId, role});
        this.props.updatedAt = new Date();
        this.addEvent({
          type: "WORKSPACE_MEMBER_ADDED",
          occuredAt: new Date(),
          workspaceId: this.props.id,
          userId: userId,
        })
    }
    
    //removing a member from the workspace.
    public removeMember(creatorId:string,userId:string):void{
        //before removing a member we use our guards:
        //1.ensure workspace is not deleted.
        //2.ensure creator is owner.
        //ensure atleast one owner is present after the operation to not to remove the last owner.
        //ensure member exists.
        this.ensureNotDeleted();
        this.ensureCallerIsOwner(creatorId);
        this.ensureNotRemovingLastOwner(userId);
        this.ensureMemberExists(userId);
        this.props.members = this.props.members.filter(member => member.userId !== userId);
        this.props.updatedAt = new Date();
        this.addEvent({
          type: "WORKSPACE_MEMBER_REMOVED",
          occuredAt: new Date(),
          workspaceId: this.props.id,
          userId: userId,
        })

    }

    public deleteWorkspace(creatorId:string,hasActiveTasks:boolean):void{
        //so before the workspace can be deleted :
        //ensure workspace is not deleted already.
        //ensure creator is owner.
        //ensure the task status of workspace is not active or in progress
        //remember we dont handle task here ,just a guard required.
        this.ensureNotDeleted();
        this.ensureCallerIsOwner(creatorId);
        this.ensureNoActiveTasks(hasActiveTasks);
        this.props.status = "deleted";
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
        this.addEvent({
          type: "WORKSPACE_DELETED",
          occuredAt: new Date(),
          workspaceId: this.props.id,
          userId: creatorId,
        })
    }
 
}

module.exports = WorkspaceDomain;