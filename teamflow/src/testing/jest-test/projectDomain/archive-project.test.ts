import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import ArchiveProjectUseCase from "../../../application/use-case/project-usecase/archive-project-usecase";


/**
 * check for correct archive flow.
 */
describe("Archive Project", () => {
    test('archive a project',()=>{
        const project = ProjectDomain.create("Test Project", "123");

        //archive the project
        project.archive();

        //assertions
        expect(project['props'].status).toBe("archived");
    })
})

/**
 * cannot archive a project if it is in deleted state.
 */
describe("Archive Project", () => {
    test('cannot archive a project if it is in deleted state',()=>{
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false); //0 active tasks

        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.archive()).toThrow("Project is deleted");
    })
})

/**
 * archiving a project should emit a PROJECT_ARCHIVED event.
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
        console.log('PROJECT ARCHIVED AND SAVED :');
        return Promise.resolve();
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :',event.type);
        return Promise.resolve();
    }
}

describe("archiving a project emits a PROJECT_ARCHIVED event", () => {
    test("should emit a PROJECT_ARCHIVED event when a project is archived", async () => {
        const project = ProjectDomain.create("Test Project", "123");
        const projectRepository = new fakeProjectRepository(project);
        const subscriber = new fakeSubscriber();

        //subscribe to the event
        let capturedEvent:any=null;
        eventBus.subscribe("PROJECT_ARCHIVED", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })

        const archiveProjectUseCase = new ArchiveProjectUseCase(projectRepository);
        await archiveProjectUseCase.execute({ projectId: project['props'].id });

        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("PROJECT_ARCHIVED");
    })
})