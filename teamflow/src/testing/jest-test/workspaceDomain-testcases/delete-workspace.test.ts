/**
 * Test cases for deleting a workspace
 * 
 * test cases :
 * case1  : workspace is not deleted already.
 * case2:workspace can be deleted only by the owner.
 * case 3: workspace should not have any active tasks.
 * case :workspace should emit a workspace "WORKSPACE_DELETED" event.
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

//test case 3 : workspace should not have any active tasks.
describe('workspace should not have any active tasks', () => {
    test('should throw error if the workspace has active tasks', () => {
        //setup ;
        let workspaceId = 'workspace-1';
        let ownerId = 'user-1';
        let taskIdStatus = true;//active task
        //action
        const testworkspace = WorkspaceDomain.create(ownerId, 'test workspace', 'test description');

        //assertion
        expect(() => testworkspace.deleteWorkspace(ownerId, taskIdStatus)).toThrow('Workspace has active or in progress tasks and cannot be deleted');
    })
})

//test case 4 : workspace should emit a workspace "WORKSPACE_DELETED" event.
class fakeWorkspaceRepository {
    private workspace :any
    constructor(workspace:any){
        this.workspace = workspace;
    }
    async findById(id:string):Promise<any>{
        return this.workspace;
    }
    async save(workspace:any):Promise<void>{
        this.workspace = workspace;
        console.log('WORKSPACE SAVED :');
        return Promise.resolve();
    }
}
class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :', event.type);
        return Promise.resolve();
    }
}
//my event subcriber;
import eventBus from "../../../domains/observability/domainEvent/eventBus";

describe('workspace should emit a workspace "WORKSPACE_DELETED" event', () => {
    test('should emit a workspace "WORKSPACE_DELETED" event', async() => {
        //setup ;
        
        let ownerId = 'user-1';
        let taskIdStatus = false;//no active tasks
        //action
        const testworkspace = WorkspaceDomain.create(ownerId, 'test workspace', 'test description');
        
        const subscriber = new fakeSubscriber();
       
        let capturedEvent:any = null;
        eventBus.subscribe('WORKSPACE_DELETED', async (event:any) => {
            capturedEvent = event;
            await subscriber.handle(capturedEvent);
        });
        const repository = new fakeWorkspaceRepository(testworkspace);
        const useCase = new DeleteWorkspaceUseCase(repository);
        const command = {
            workspaceId: `${testworkspace['props'].id}`,
            actorId: ownerId,
            hasActiveTasks: taskIdStatus
        }
        await useCase.execute(command);
        //assertion
        // expect(capturedEvent).not.toBeNull();
        expect(testworkspace['props'].status).toBe('deleted');
        expect(capturedEvent.type).toBe('WORKSPACE_DELETED');
       
    })
})