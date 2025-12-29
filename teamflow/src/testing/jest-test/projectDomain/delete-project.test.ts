import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import DeleteProjectUseCase from "../../../application/use-case/project-usecase/delete-project-usecase";


/**
 * cannot delete a project if it is in deleted state.
 */
describe("Delete Project", () => {
    test('cannot delete a project if it is in deleted state',()=>{
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false); //0 active tasks
        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.delete(false)).toThrow("Project is deleted");
    })
})

/**
 * cannot delete a project if it has active tasks.
 */
describe("Delete Project", () => {
    test('cannot delete a project if it has active tasks',()=>{
        const project = ProjectDomain.create("Test Project", "123");

        //action and assertions
        expect(()=>project.delete(true)).toThrow("Project cannot be deleted as it contains active tasks");
    })
})

/**
 * deleting a project should emit a PROJECT_DELETED event.
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
        console.log('PROJECT DELETED AND SAVED :');
        return Promise.resolve();
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :',event.type);
        return Promise.resolve();
    }
}

describe("deleting a project emits a PROJECT_DELETED event", () => {
    test("should emit a PROJECT_DELETED event when a project is deleted", async () => {
        const project = ProjectDomain.create("Test Project", "123");
        const projectRepository = new fakeProjectRepository(project);
        const subscriber = new fakeSubscriber();

        //subscribe to the event
        let capturedEvent:any=null;
        eventBus.subscribe("PROJECT_DELETED", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })

        const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);
        await deleteProjectUseCase.execute({ projectId: project['props'].id, hasActiveTasks: false });

        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("PROJECT_DELETED")
        })
})