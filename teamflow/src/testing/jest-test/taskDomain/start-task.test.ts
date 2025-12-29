import TaskDomain from "../../../domains/operational/task/task";
import eventBus from "../../../domains/observability/domainEvent/eventBus";




/**
 * cannot start task with empty title.
 */
describe("Start Task", () => {
    test("cannot start task with empty title", () => {
        const task = new TaskDomain({
            id: "123",
            title: "",
            description: "Test Description",
            assigneeId: "456",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            status: "todo"
        });
        //action and assertions
        expect(()=>task.start()).toThrow("Task title is required");
    })
})

/**
 * cannot start task with deleted status.
 */
describe("Start Task", () => {
    test("cannot start task with deleted status", () => {
        const task = new TaskDomain({
            id: "123",
            title: "Test Task",
            description: "Test Description",
            assigneeId: "456",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
            status: "deleted"
        });
        //action and assertions
        expect(()=>task.start()).toThrow("Task is deleted");
    })
})

/**
 * start task should emit a TASK_STARTED event.
 */
import StartTaskUseCase from "../../../application/use-case/task-usecase/start-task-usecase";
class fakeTaskRepository {
    private tasks:Record<string,TaskDomain>={};
    constructor(initialTask?:TaskDomain){
        if(initialTask){
            this.tasks[initialTask['props'].id] = initialTask;
        }
    }
    findById(id:string):Promise<TaskDomain | null>{
        const task = this.tasks[id];
        console.log('FINDING TASK BY ID :',id);
        return Promise.resolve(task || null);
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

describe("start task should emit a TASK_STARTED event", () => {
    test("should emit a TASK_STARTED event when a task is started", async () => {
        const task = new TaskDomain({
            id: "123",
            title: "Test Task",
            description: "Test Description",
            assigneeId: undefined,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            status: "todo"
        });


        //action
        task.create();
        const taskRepository = new fakeTaskRepository(task);
        const subscriber = new fakeSubscriber();
        let capturedEvent:any=null;
        eventBus.subscribe("TASK_STARTED", async(event:any)=>{
            capturedEvent=event;
            await subscriber.handle(capturedEvent);
        })
        const startTaskUseCase = new StartTaskUseCase(taskRepository);
        await startTaskUseCase.execute({ taskId: task['props'].id });

        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_STARTED");
    })
})