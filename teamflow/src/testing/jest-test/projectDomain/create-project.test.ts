import ProjectDomain from "../../../domains/operational/project/project";


//testcase 1: creating a project;
//for a project to be created, a name and workspace id are required.
describe('creating a project', () => {
    test('project must belong to a workspace', () => {
        //setup ;
        let name = 'test project';
        let workspaceId = '';

        //action and assertion
        expect(() => ProjectDomain.create(name, workspaceId)).toThrow('Workspace ID is required');
    })
})

//testcase 2: project creation with a valid name and workspace id must emit PROJECT_CREATED event.

import eventBus from "../../../domains/observability/domainEvent/eventBus";
import CreateProjectUseCase from "../../../application/use-case/project-usecase/create-project-usecase";
class fakeProjectRepository {
    private projects: any
    constructor(projects: any) {
        this.projects = projects;
    }
    save(project: any): Promise<void> {
        console.log('PROJECT SAVED :');
        this.projects = project;
        return Promise.resolve();
    }
}

class fakeprojectSubscriber {
    handle(event: any): Promise<void> {
        console.log('PROJECT EVENT HANDLED :', event.type);
        return Promise.resolve();
    }
}

describe('project creation event emit test', () => {
    test(`should emit PROJECT_CREATED event when a project is created`, async () => {
        //setup
        let projectName = 'test project';
        let workspaceId = 'workspace-1';
        //action
        const project = ProjectDomain.create(projectName, workspaceId);
        const repository = new fakeProjectRepository(project);
        const subscriber = new fakeprojectSubscriber();
        const useCase = new CreateProjectUseCase(repository);

        let captureEvent: any = null;
        eventBus.subscribe("PROJECT_CREATED", async (event: any) =>{
            captureEvent = event;
            await subscriber.handle(captureEvent);
        })
           
     await useCase.execute({name:projectName,workspaceId:workspaceId});
    //assertion
    expect(captureEvent).not.toBeNull();
    expect(captureEvent.type).toBe('PROJECT_CREATED');

})
})
