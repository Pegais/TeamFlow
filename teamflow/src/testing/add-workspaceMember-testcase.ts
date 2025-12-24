const AddWorkspaceMemberUseCase = require('../application/use-case/workspace-usecase/add-memberWorkspace-usecase');
const eventBus = require('../domains/observability/domainEvent/eventBus');
const WorkspaceDomain = require('../domains/coretruthDomain/user/workspaceDomains/workspace/workspace');

/**
 * creating a fake repository for the workspace domain :
 */

/**
 * this fake repository is used to store the workspace in memory.
 * kind of in memory database.
 */
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
    }
}

/**
 * creating a fake subscriber for the event bus :
 */
class FakeSubscriber {
    handle(event: any): void {
        console.log('Subscriber received event:', event.type);
    }
}

const subscriber = new FakeSubscriber();
eventBus.subscribe('WORKSPACE_MEMBER_ADDED', (event: any) => subscriber.handle(event));


/**
 * creating a workspace domain instance :
 */
const workspace = WorkspaceDomain.create('user1', 'workspace 1', 'workspace 1 description');


//creating a workspace repository instance :
const repository = new FakeWorkspaceRepository(workspace);
//creating a add workspace member use case instance :
const addWorkspaceMemberUseCase = new AddWorkspaceMemberUseCase(repository);


//creating a function to execute the add workspace member use case :
async function test() {
    try {
        console.log('Executing add workspace member use case...');

        await addWorkspaceMemberUseCase.execute({
            workspaceId: 'workspace1',
            actorId: 'user1', // who is performing the action :must be owner 
            userId: 'user2',
            role: 'member'
        });
        console.log('Add workspace member use case executed successfully');
        console.log('Test finished');
    } catch (error) {
        console.error('Error executing add workspace member use case:', error);
    }
}

test();