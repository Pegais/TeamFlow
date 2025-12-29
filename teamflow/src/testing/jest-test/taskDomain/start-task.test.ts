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