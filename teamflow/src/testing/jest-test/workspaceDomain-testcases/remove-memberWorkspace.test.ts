import WorkspaceDomain from "../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace";

/**
 * Defining the test cases for the remove member from workspace domain.
 * 
 * Based on our invarients and domain enforcements.
 * 1.we can remove member from workspace only when the my role is owner or team head.
 * 2.we can remove member from workspace only when the member is present in the workspace.
 * 3.we cannot remove member from workspace if the workspace is deleted.
 * 4.we cannot remove member from workspace if the member is the last owner.
 * 5.we cannot remove member if the member is not present in the workspace.
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
        ).toThrow("Member is the last owner and cannot be removed");
        //error thrown should be same as that of error getting from invariant enforcers in workspace domain.
    //     Expected substring: "Member is the last owner and cannot be removed"
    // Received message:   "Cannot remove the last owner from the workspace"

    /**
     * getting this error during testing is good as we can see our invariant enforcers are working as expected.
     */
      
        
    })
})