import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import RemoveTaskFromProjectUseCase from "../../../application/use-case/project-usecase/removeTask-project-usecase";
import AddTaskToProjectUseCase from "../../../application/use-case/project-usecase/addTask-project-usecase";
/**
 * we cannot remove a task from deleted project.
 */
describe("Remove Task from Project", () => {
    test("we cannot remove a task from deleted project", () => {
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false); //0 active tasks
        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.remove("task1")).toThrow("Project is deleted");
    })  
})

/**
 * removing a task from a project should emit a TASK_REMOVED_FROM_PROJECT event.
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
        console.log('PROJECT TASKS SAVED :',project['props'].taskIds);
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
    //helper function to check if a task is in a project:
    hasTask(projectId:string,taskId:string):boolean{
        const taskIds = this.getTaskIds(projectId);
        return taskIds.includes(taskId);
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :',event.type);
        return Promise.resolve();
    }
}

describe("removing a task from a project should emit a TASK_REMOVED_FROM_PROJECT event", () => {
    test("should emit a TASK_REMOVED_FROM_PROJECT event when a task is removed from a project", async () => {
        const project = ProjectDomain.create("Test Project", "123");
        const projectRepository = new fakeProjectRepository(project);
        const subscriber = new fakeSubscriber();
        //subscribe to the event
        let capturedEvent:any=null;
        eventBus.subscribe("TASK_REMOVED_FROM_PROJECT", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })
        eventBus.subscribe("TASK_ADDED_TO_PROJECT", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })
        //to remove the task we need to add a task to the project first.
        const addTaskUseCase = new AddTaskToProjectUseCase(projectRepository);
        await addTaskUseCase.execute({ projectId: project['props'].id, taskId: "task1" });
        await addTaskUseCase.execute({ projectId: project['props'].id, taskId: "task2" });
        await addTaskUseCase.execute({ projectId: project['props'].id, taskId: "task3" });
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_ADDED_TO_PROJECT");
        
        //now remove the task
        const removeTaskUseCase = new RemoveTaskFromProjectUseCase(projectRepository);
        await removeTaskUseCase.execute({ projectId: project['props'].id, taskId: "task1" });
        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_REMOVED_FROM_PROJECT");
        expect(projectRepository.getTaskIds(project['props'].id)).toHaveLength(2);
    })
})