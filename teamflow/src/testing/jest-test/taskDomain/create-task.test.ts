import TaskDomain from "../../../domains/operational/task/task";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import CreateTaskUseCase from "../../../application/use-case/task-usecase/create-task-usecase";
import { cp } from "node:fs";

/**
 * cannot create task with empty title.
 */
describe("Create Task", () => {
    test("cannot create task with empty title", () => {
        const task = new TaskDomain({
            id: "123",
             title: "", 
             assigneeId: "456",
             description: "Test Description" ,
             createdAt: new Date(),
             updatedAt: new Date(),
             deletedAt: null,
             status: "todo"
            
            });
        //action and assertions
        expect(()=>task.create()).toThrow("Task title is required");

    })
})


/**
 * create task should emit a TASK_CREATED event.
 */

class fakeTaskRepository {
    private tasks:Record<string,TaskDomain>={};
    constructor(initialTask?:TaskDomain){
        if(initialTask){
            this.tasks[initialTask['props'].id] = initialTask;
        }
    }
  
    save(task:TaskDomain):Promise<void>{
        const taskId = task['props'].id;
        this.tasks[taskId] = task;
        console.log('TASK SAVED :',task['props'].id);
        return Promise.resolve();
    }
}

class fakeSubscriber{
    handle(event:any):Promise<void>{
        console.log('EVENT HANDLED :',event.type);
        return Promise.resolve();
    }
}
describe("create task should emit a TASK_CREATED event", () => {
    test("should emit a TASK_CREATED event when a task is created", async () => {
        const task = new TaskDomain({
            id: "123",
            title: "Test Task",
            description: "Test Description",
            assigneeId: "undefined",
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            status: "todo"
        });
       
        const subscriber = new fakeSubscriber();
        let capturedEvent:any=null;
        eventBus.subscribe("TASK_CREATED", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })
        const taskRepository = new fakeTaskRepository(task);
        const createTaskUseCase = new CreateTaskUseCase(taskRepository);
        await createTaskUseCase.execute({
            title: "Test Task",
            description: "Test Description",
            assigneeId: "undefined"
        });

        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_CREATED");
        
    })
})