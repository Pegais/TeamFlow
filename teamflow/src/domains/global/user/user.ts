//User DOMAIN
//User: User is identity of the person coming to our system.
//it can independently exist in the system without any workspace.

//criteria of User:
//a user can exist without any workspace.
//a user can exist with a workspace or multiple workspaces.
//a user can be active or deleted.
//a deleted user can not act anywhere in the system.

//defininf the user invariants:
//1.A user has a id,email ,name.
//2.the email is unique and immutable i.e it can not be changed once created.
//3.User has lifecyle of active,suspended,deleted.
//4.deleted user cannot perform any action nor their account can be reactivated.
//5.a suspended user can not perform any action but their account can be reactivated.

//User domain does not care about:
//workSpace roles,tasks,projects,etc.

//  CORE :User domain answers:
// “Does this user exist and is it allowed to act?”

import type { UserProps, UserStatus } from "./user.types";
import { v4 as uuidv4 } from 'uuid';
class User{
    private props:UserProps



    //guards for user domain:





    //guard 1: ensure email and name are provided.
    private ensureEmailAndNameAreProvided():void{
        if(!this.props.email || !this.props.name){
            throw new Error("Email and name are required");
        }
    }
   

    //guard 2: ensure user is not deleted
    private ensureNotDeleted():void{
        if(this.props.status === "deleted"){
            throw new Error("User is deleted and cannot be modified");
        }
    }

    //guard 3:ensure user is active.
    private ensureActive():void{
        if(this.props.status !== "active" ){
            throw new Error("User is not active");
        }
    }
    //guard 4:ensure user is  suspended
    private ensureUserIsSuspended():void{
        if(this.props.status !== "suspended"){
            throw new Error("User is not suspended");
        }
    }

    constructor(props:UserProps){
        this.props = props;
    }

    //valid domain operations:
    public static createUser(email:string,name:string):User{
        //ensure email and name are provided.
        if(!email || !name || email === '' || name === ''){
            throw new Error("Email and name are required");
        }
        return new User({
            id: uuidv4(),
            email: email,
            name: name,
            status: "active",
            updatedAt: new Date(),
            createdAt: new Date(),
            deletedAt: null,
        })
     
     
    }


    //suspend user
    public suspendUser():void{
        //to suspent a user, user must exist and must be active.

        this.ensureNotDeleted();
        this.ensureActive();
        //update the user properties.
        this.props.status = "suspended";
        this.props.updatedAt = new Date();
    

    }

    //activate user 
    public activateUser(email:string):void{
        //to avticate user, user must exist and must be suspended.
    
        this.ensureNotDeleted();
        this.ensureUserIsSuspended();
        //update the user properties.
        this.props.status = "active";
        this.props.updatedAt = new Date();
    
    }

    //delete user
    public deleteUser(email:string):void{
        //to delete user , user must exist not deleted already  and must be active.

  
        this.ensureNotDeleted();
        this.ensureActive();
        //update the user properties.
        this.props.status = "deleted";
        this.props.updatedAt = new Date();
        this.props.deletedAt = new Date();
    }
}


export default User;