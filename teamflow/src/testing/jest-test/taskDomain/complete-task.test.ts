import TaskDomain from "../../../domains/operational/task/task";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import CompleteTaskUseCase from "../../../application/use-case/task-usecase/complete-task-usecase";
import StartTaskUseCase from "../../../application/use-case/task-usecase/start-task-usecase";
import CreateTaskUseCase from "../../../application/use-case/task-usecase/create-task-usecase";

/**
 * cannot complete task with empty title.
 */
describe("Complete Task", () => {
    test("cannot complete task with empty title", () => {
        const task = new TaskDomain({
            id: "123",
            title: "",
            description: "Test Description",
            assigneeId: "456",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            status: "in_progress"
        });
        //action and assertions
        expect(() => task.complete()).toThrow("Task title is required");
    })
})

/**
 * cannot complete task with deleted status.
 */
describe("Complete Task", () => {
    test("cannot complete task with deleted status", () => {
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
        expect(() => task.complete()).toThrow("Task is deleted");
    })
})

/**
 * complete task should emit a TASK_COMPLETED event.
 */
class fakeTaskRepository {
    private tasks: Record<string, TaskDomain> = {};
    constructor(initialTask?: TaskDomain) {
        if (initialTask) {
            this.tasks[initialTask['props'].id] = initialTask;
        }
    }
    findById(id: string): Promise<TaskDomain | null> {
        const task = this.tasks[id];
        console.log('FINDING TASK BY ID :', id);
        return Promise.resolve(task || null);
    }
    save(task: TaskDomain): Promise<void> {
        const taskId = task['props'].id;
        this.tasks[taskId] = task;
        console.log('TASK SAVED :', task['props'].id);
        return Promise.resolve();
    }
}

class fakeSubscriber {
    handle(event: any): Promise<void> {
        console.log('EVENT HANDLED :', event.type);
        return Promise.resolve();
    }
}
describe("complete task should emit a TASK_COMPLETED event", () => {
    test("should emit a TASK_COMPLETED event when a task is completed", async () => {

        //setup
        const taskRepository = new fakeTaskRepository();
        const subscriber = new fakeSubscriber();

        //event subscription
        let capturedEvent: any = null;
        eventBus.subscribe("TASK_CREATED", async (event: any) => {
            capturedEvent = event;
            await subscriber.handle(capturedEvent);
        })
        eventBus.subscribe("TASK_STARTED", async (event: any) => {
            capturedEvent = event;
            await subscriber.handle(capturedEvent);
        })
        eventBus.subscribe("TASK_COMPLETED", async (event: any) => {
            capturedEvent = event;
            await subscriber.handle(capturedEvent);
        })

        //actions : create task
        const createTaskUseCase = new CreateTaskUseCase(taskRepository);
        await createTaskUseCase.execute({
            title: "Test Task",
            description: "Test Description",
            assigneeId: "undefined"
        });
        //getting the taskid from repository
        const alltaskIds = Object.keys((taskRepository as any).tasks);
        const createdTaskId = alltaskIds[0]; //this is the first task in the repository
        

        //assertions 1.
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_CREATED");
        expect(createdTaskId).toBeDefined();

        //actions : start task
        const startTaskUseCase = new StartTaskUseCase(taskRepository);
        await startTaskUseCase.execute({ taskId: createdTaskId as string });
        //assertions 2.
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_STARTED");
     

        //actions : complete task
        const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);
        await completeTaskUseCase.execute({ taskId: createdTaskId as string });
        //assertions 3.
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent['type']).toBe("TASK_COMPLETED");
      
        
        
        
    })
})