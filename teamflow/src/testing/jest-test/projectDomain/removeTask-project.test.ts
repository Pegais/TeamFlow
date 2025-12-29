import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import RemoveTaskFromProjectUseCase from "../../../application/use-case/project-usecase/removeTask-project-usecase";

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