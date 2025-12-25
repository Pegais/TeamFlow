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
        let ownerid='user-1';
        let memberid='user-2';

        const testworkspace = WorkspaceDomain.create(ownerid, "test workspace", "test description");
        testworkspace.addMember(ownerid, memberid, "member");
        //act
        testworkspace.removeMember(ownerid, memberid);

        //assertion
        expect(testworkspace['props'].members.length).toBe(1);
        expect(testworkspace['props'].members[0]?.role).toBe("owner");
    })
})