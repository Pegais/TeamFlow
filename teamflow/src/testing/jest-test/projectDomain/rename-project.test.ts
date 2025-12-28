import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import RenameProjectUseCase from "../../../application/use-case/project-usecase/rename-project-usecase";


/**
 * to rename a project , project must not be deleted.
 */
describe('renaming a project',()=>{
    test('cannot rename a deleted project',()=>{
        //setup
        let projectName = 'test project';
        let workspaceId = 'workspace-1';
        let project = ProjectDomain.create(projectName,workspaceId);
        project.delete(false);
        //action and assertion
        expect(() => project.rename('new project name')).toThrow('Project is deleted');
    })
})

/**
 * to rename a project , project must have a name.
 */
describe('renaming a project',()=>{
    test('project must have a name',()=>{
        //setup
        let projectName = 'test project';
        let workspaceId = 'workspace-1';
        let project = ProjectDomain.create(projectName,workspaceId);
        //action and assertion
        expect(() => project.rename('')).toThrow('Project name is required');
    })
})


/**
 * must emit PROJECT_RENAMED event when a project is renamed.
 */

class fakeProjectRepository {
    private projects:Record<string,ProjectDomain>={};
    constructor(initialProject?:ProjectDomain){
        if(initialProject){
            this.projects[initialProject['props'].name] = initialProject;
        }
    }
    findByName(name:string):Promise<ProjectDomain | null>{
       return Promise.resolve(this.projects[name] || null);
    }
    save(project:any):Promise<void>{
        const projectName = project['props'].name;
        this.projects[projectName] = project;
        console.log('PROJECT RENAMED AND SAVED :');
        return Promise.resolve();
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('PROJECT RENAMED EVENT HANDLED :',event.type);
        return Promise.resolve();
    }
}

describe('renaming a project event emit test',()=>{
    test('should emit PROJECT_RENAMED event when a project is renamed',async()=>{
        //setup
        let projectName = 'test project';
        let workspaceId = 'workspace-1';
        let project = ProjectDomain.create(projectName,workspaceId);
        const repository = new fakeProjectRepository(project);
        const subscriber = new fakeSubscriber();
        const useCase = new RenameProjectUseCase(repository);
        let captureEvent:any=null;
        eventBus.subscribe("PROJECT_RENAMED",async(event:any)=>{
            captureEvent = event;
            await subscriber.handle(captureEvent);
        });
        //action
        await useCase.execute({projectExistingName:projectName,newName:'new project name'});
        //assertion
        expect(captureEvent).not.toBeNull();
        expect(captureEvent.type).toBe('PROJECT_RENAMED');
    })
})