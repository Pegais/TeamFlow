/**
 * Test cases for deleting a workspace
 * 
 * test cases :
 * case1  : workspace is not deleted already.
 * case2:workspace can be deleted only by the owner.
 * case 3: workspace should not have any active tasks.
 * 
 */
import WorkspaceDomain from "../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace";

import DeleteWorkspaceUseCase from "../../../application/use-case/workspace-usecase/delete-workspace-usecase";

//test case 1 : workspace is not deleted already.

describe('delete workspace when the workspace is deleted already', () => {
    test('should throw error if the workspace is deleted already', () => {
        //setup ;
        let workspaceId = 'workspace-1';
        let ownerId = 'user-1';

        //action
        const testworkspace = WorkspaceDomain.create(ownerId, 'test workspace', 'test description');
        testworkspace.deleteWorkspace(ownerId, false);
        //assertion
        expect(() => testworkspace.deleteWorkspace(ownerId, false)).toThrow('Workspace is deleted and cannot be modified');
    })
})
// Expected substring: "Workspace is already deleted"
// Received message:   "Workspace is deleted and cannot be modified"
//it means our guard of workspace is being triggered.


//test case 2 : workspace can be deleted only by the owner.
describe('workspace can be deleted only by the owner', () => {
    test('should throw error if the workspace is not deleted by the owner', () => {
        //setup ;
        let workspaceId = 'workspace-1';
        let ownerId = 'user-1';
        let attackerId = 'user-2';
        //action
        const testworkspace = WorkspaceDomain.create(ownerId, 'test workspace', 'test description');

        //assertion
        expect(() => testworkspace.deleteWorkspace(attackerId, false)).toThrow('Only Owner can perform this action');
    })
})