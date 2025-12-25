import WorkspaceDomain from "../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace";

/**
 * Defining the test cases for the remove member from workspace domain.
 * 
 * Based on our invarients and domain enforcements.
 * 1.we can remove member from workspace only when the my role is owner or team head.
 
 * 2.we cannot remove member from workspace if the workspace is deleted.
 * 3.we cannot remove member from workspace if the member is the last owner.
 * 4.we cannot remove member if the member is not present in the workspace.
 * 5.we must get "WORKSPACE_MEMBER_REMOVED" event when a member is removed from the workspace successfully.
 */

describe("remove member from workspace domain", () => {
    test("should remove member from workspace", () => {
        //setup
        let ownerid = 'user-1';
        let memberid = 'user-2';

        const testworkspace = WorkspaceDomain.create(ownerid, "test workspace", "test description");
        testworkspace.addMember(ownerid, memberid, "member");
        //act
        testworkspace.removeMember(ownerid, memberid);

        //assertion
        expect(testworkspace['props'].members.length).toBe(1);
        expect(testworkspace['props'].members[0]?.role).toBe("owner");
    })
})

//edge cases 2 :* 2.we can remove member from workspace only when the member is present in the workspace.

describe("remove member from workspace domain without adding the member first", () => {
    test("should throw error if the member is not present in the workspace", () => {
        //setup
        let ownerid = 'user-1';
        let memberid = 'user-2';

        //act
        const testworkspace = WorkspaceDomain.create(ownerid, "test workspace", "test description");

        //assertion

        //expecting an error to be thrown
        //error thorwn should be same as that of error getting from invariant enforcers in workspace domain.
        expect(() =>
            testworkspace.removeMember(ownerid, memberid)
        ).toThrow("Member does not exist in the workspace");
    })


})


//edge cases 3 :* 3.we cannot remove member from workspace if the workspace is deleted.

describe("remove member from deleted workspace", () => {
    test("should throw error if the workspace is deleted", () => {

        //setup
        let ownerid = 'user-1';
        let memberid = 'user-2';

        const testworkspace1 = WorkspaceDomain.create(ownerid, "test workspace", "test description");
        testworkspace1.deleteWorkspace(ownerid, false);

        //act and assertion
        expect(() =>
            testworkspace1.removeMember(ownerid, memberid)
        ).toThrow("Workspace is deleted and cannot be modified");
        //error thrown should be same as that of error getting from invariant enforcers in workspace domain.
        // Expected substring: "Workspace has been deleted"
        // Received message:   "Workspace is deleted and cannot be modified"
    

    })


})


//edge cases 4 :* 4.we cannot remove member from workspace if the member is the last owner.

describe("remove member from workspace when the member is the last owner", () => {
    test("should throw error if the member is the last owner", () => {
        //setup

        let ownerid = 'user-1';
        let memberid = 'user-1';//id to be removed is same as the owner id.

        //action
        const testworkspace = WorkspaceDomain.create(ownerid, "test workspace", "test description");

        //assertion
        expect(()=>
        testworkspace.removeMember(ownerid, memberid)
        ).toThrow("Cannot remove the last owner from the workspace");
        //error thrown should be same as that of error getting from invariant enforcers in workspace domain.
    //     Expected substring: "Member is the last owner and cannot be removed"
    // Received message:   "Cannot remove the last owner from the workspace"

    /**
     * getting this error during testing is good as we can see our invariant enforcers are working as expected.
     */
      
        
    })
})


//edcase 5 :* 5.we must get "WORKSPACE_MEMBER_REMOVED" event when a member is removed from the workspace successfully.

import eventBus from "../../../domains/observability/domainEvent/eventBus";
import RemoveWorkspaceMemberUseCase from "../../../application/use-case/workspace-usecase/remove-memberWorkspace-usecase";
import AddWorkspaceMemberUseCase from "../../../application/use-case/workspace-usecase/add-memberWorkspace-usecase";
class FakeWorkspaceRepository{
    private workspace:any
    constructor(workspace:any){
        this.workspace = workspace
    }
    async findById(id:string):Promise<any>{
        return this.workspace
    }
    async save(workspace:any):Promise<void>{
        console.log('WORKSPACE SAVED :');
        this.workspace = workspace
    }
}

class FakeSubscriber{
    handle(event:any):Promise<void>{
       
        let custommessage=`Let send notification to evey domain that this ${event.type} event has been emitted.`;
        console.log(custommessage);
        return Promise.resolve();
    }
}

describe("remove member from workspace domain and get the event", () => {
    test("event emitted when memeber is removed from workspace", async () => {
        //setup
        let ownerid = 'user-1';
        let memberid = 'user-2';

        const testworkspace5 = WorkspaceDomain.create(ownerid, "test workspace", "test description");
        const subscriber = new FakeSubscriber();
        //event subscription for add member use case
        eventBus.subscribe('WORKSPACE_MEMBER_ADDED', async (event:any) => {
            await subscriber.handle(event);
        });
        //event subscription for remove member use case
        let capturedEvent:any = null;
        eventBus.subscribe('WORKSPACE_MEMBER_REMOVED', async (event:any) => {
            capturedEvent = event;
            await subscriber.handle(capturedEvent);
        });

        const repository = new FakeWorkspaceRepository(testworkspace5);
        const addUsecase = new AddWorkspaceMemberUseCase(repository);
        const removeUsecase = new RemoveWorkspaceMemberUseCase(repository);
        await addUsecase.execute({
            workspaceId: `${testworkspace5['props'].id}-1`,
            actorId: ownerid,
            userId: memberid,
            role: 'member'
        });

        await removeUsecase.execute({
            workspaceId: `${testworkspace5['props'].id}-1`,
            actorId: ownerid,
            userId: memberid,
        });

        //assertion
        expect(testworkspace5['props'].members.length).toBe(1);
        expect(testworkspace5['props'].members[0]?.role).toBe("owner");
        expect(capturedEvent.type).toBe("WORKSPACE_MEMBER_REMOVED");
      
    })
})