import TaskDomain from "../../../domains/operational/task/task";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import CompleteTaskUseCase from "../../../application/use-case/task-usecase/complete-task-usecase";


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
        expect(()=>task.complete()).toThrow("Task title is required");
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
        expect(()=>task.complete()).toThrow("Task is deleted");
    })
})

/**
 * complete task should emit a TASK_COMPLETED event.
 */
