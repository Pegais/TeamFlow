import ProjectDomain
 from "../../../domains/operational/project/project";
 import eventBus
  from "../../../domains/observability/domainEvent/eventBus";
import RestoreProjectUseCase from "../../../application/use-case/project-usecase/restore-project-usecase";


/**
 * to restore the project project must not be in deleted state.
 * 
 */
describe("Restore Project", () => {
    test("should not restore the project if it is in deleted state", () => {
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false);

        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.restore()).toThrow("Project is deleted");
    })
})


/**
 * restorinf aproject should emit a PROJECT_RESTORED event.
 */

class fakeProjectRepository {
    private projects:Record<string,ProjectDomain>={};
    constructor(initialProject?:ProjectDomain){
        if(initialProject){
            this.projects[initialProject['props'].id] = initialProject;
        }
    }
    findById(id:string):Promise<ProjectDomain | null>{
        console.log('FINDING PROJECT BY ID :',id);
        return Promise.resolve(this.projects[id] || null);
    }
    save(project:ProjectDomain):Promise<void>{
        const projectId = project['props'].id;
        this.projects[projectId] = project;
        console.log('PROJECT RESTORED AND SAVED :');
        return Promise.resolve();
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :',event);
        return Promise.resolve();
    }
}

describe("restoring project emits a PROJECT_RESTORED event", () => {
    test("should emit a PROJECT_RESTORED event when a project is restored", async () => {
        const project = ProjectDomain.create("Test Project", "123");
        project.archive();
        const projectRepository = new fakeProjectRepository(project);
        const subscriber = new fakeSubscriber();

        //subscribe to the event
        let capturedEvent:any=null;
        eventBus.subscribe("PROJECT_RESTORED", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        });

        const restoreProjectUseCase = new RestoreProjectUseCase(projectRepository);
        await restoreProjectUseCase.execute({ projectId: project['props'].id });

        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("PROJECT_RESTORED");
    })
})