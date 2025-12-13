import type { WorkspaceProps } from "./workspace.types";
const {v4: uuidv4} = require('uuid');
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
    constructor(props:WorkspaceProps){
        this.props=props;
    }

    //defining methods :
    //single source of truth for the workspace creation when atleast one user as owner or team head.
    createWorkSpace(name:string,description:string,creator:string,userids:string[]):void{
        if(this.props.id !==null && this.props.userids.length > 0){
            throw new Error(`WorkSpace with ${this.props.id} already exists and has ${this.props.userids.length} users`);
            
        }
        if(creator !==null && creator.toLowerCase() !== "owner" && creator.toLowerCase() !== "teamhead"){
            throw new Error(`Creator ${creator} is not authorized to create a workspace`);    
        }
     
        if(userids.length > 20){
            throw new Error(`Workspace cannot have more than 20 users`);
        }
         this.props.id = uuidv4();
         this.props.name = name;
         this.props.description = description;
         this.props.creator = creator;
         this.props.userids = userids;
         this.props.status = "active";
         this.props.createdAt = new Date();
         this.props.updatedAt = new Date();
         this.props.deletedAt = null;
         this.props.taskids = [];
         this.props.projectids = [];    
         this.props.userids.push(creator)
    }
}