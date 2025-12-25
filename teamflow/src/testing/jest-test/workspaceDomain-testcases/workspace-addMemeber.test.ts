import WorkspaceDomain from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace';
import eventBus from '../../../domains/observability/domainEvent/eventBus';
import addWorkspaceMemberUseCase from '../../../application/use-case/workspace-usecase/add-memberWorkspace-usecase';


//creating a fake repository for the workspace domain :
//act as db in memory for the workspace domain.
class FakeWorkspaceRepository {
    private workspace: any;
    constructor(workspace: any) {
        this.workspace = workspace;
    }
    async findById(id: string): Promise<any> {
        return this.workspace;
    }
    async save(workspace: any): Promise<void> {
        console.log('workspace saved', workspace);
        this.workspace = workspace;
    }
}

//creating a fake subscriber for the event bus :
class FakeSubscriber {
    handle(event: any): Promise<void> {
        console.log('Subscriber received event:', event.type);
        return Promise.resolve();
    }
}
//creating instance of the fake subscriber :



const testSubscriber = new FakeSubscriber();
let testworkspace = WorkspaceDomain.create('user-1', 'workspace-1', 'description-1');

const repository = new FakeWorkspaceRepository(testworkspace);
const useCase = new addWorkspaceMemberUseCase(repository);
describe('workspace add member test', () => {
    test('should add a member to the workspace', async () => {
        //setup
        const memberId = 'user-2';
        const role = 'member';
        const actorId = 'user-1';

        //capture events
        let capturedEvent: any = null;
       
        eventBus.subscribe('WORKSPACE_MEMBER_ADDED', async (event: any) =>{
            capturedEvent = event;
            await testSubscriber.handle(capturedEvent)
        })


      ;
    //action
    await useCase.execute({
        workspaceId: `${testworkspace['props'].id}`,
        actorId: actorId,
        userId: memberId,
        role: role,
    });
    //assertion
    const updatedworkspace = await repository.findById(`${testworkspace['props'].id}`);

    expect(updatedworkspace['props'].members.length).toBe(2);
    expect(updatedworkspace['props'].members[1].role).toBe('member');
    expect(updatedworkspace['props'].members[0].role).toBe('owner');
    expect(updatedworkspace['props'].userids.length).toBe(2);
    expect(capturedEvent.type).toBe('WORKSPACE_MEMBER_ADDED');
  
});
});