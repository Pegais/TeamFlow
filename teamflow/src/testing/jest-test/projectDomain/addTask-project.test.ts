import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import AddTaskToProjectUseCase from "../../../application/use-case/project-usecase/addTask-project-usecase";


/**
 * cannot add a task to a project if it is in deleted state.
 */
describe("Add Task to Project", () => {
    test('cannot add a task to a project if it is in deleted state',()=>{
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false); //0 active tasks
        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.add("task1")).toThrow("Project is deleted");
    })
})

/**
 * ensure a archived project can not accept new tasks.
 */
describe("Add Task to Project in arhive state", () => {
    test('ensure a archived project can not accept new tasks',()=>{
        const project = ProjectDomain.create("Test Project", "123");
        project.archive();
        //assertions
        expect(project['props'].status).toBe("archived");
        expect(()=>project.add("task1")).toThrow("Archived project cannot accept new tasks");
    })
})

/**
 * addtask to project should emit a PROJECT_TASK_ADDED event.
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
        console.log('PROJECT TASK ADDED AND SAVED :');
        return Promise.resolve();
    }

    //helper function to get task ids for a project:
    getTaskIds(projectId:string):string[]{
        const project = this.projects[projectId];
        if(!project){
            return [];
        }
        return project['props'].taskIds || [];
    }

    //helper to check if atask is already in a project:
    hasTask(projectId:string,taskId:string):boolean{
        const taskIds = this.getTaskIds(projectId);
        console.log('taskIds:',taskIds);
        return taskIds.includes(taskId);
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :',event.type);
        return Promise.resolve();
    }
}

describe("addtask to project should emit a PROJECT_TASK_ADDED event", () => {
    test("should emit a PROJECT_TASK_ADDED event when a task is added to a project", async () => {
        const project = ProjectDomain.create("Test Project", "123");
        const projectRepository = new fakeProjectRepository(project);
        const subscriber = new fakeSubscriber();
        //subscribe to the event
        let capturedEvent:any=null;
        eventBus.subscribe("TASK_ADDED_TO_PROJECT", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })
        const addTaskUseCase = new AddTaskToProjectUseCase(projectRepository);
        await addTaskUseCase.execute({ projectId: project['props'].id, taskId: "task1" });
        await addTaskUseCase.execute({ projectId: project['props'].id, taskId: "task2" });
        await addTaskUseCase.execute({ projectId: project['props'].id, taskId: "task3" });
        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_ADDED_TO_PROJECT");
       expect(projectRepository.getTaskIds(project['props'].id)).toHaveLength(3);
       expect(projectRepository.hasTask(project['props'].id, "task1")).toBe(true);
       
    })
})