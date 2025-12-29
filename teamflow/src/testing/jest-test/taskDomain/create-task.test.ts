import TaskDomain from "../../../domains/operational/task/task";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import CreateTaskUseCase from "../../../application/use-case/task-usecase/create-task-usecase";

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