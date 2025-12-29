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