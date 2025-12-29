import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import DeleteProjectUseCase from "../../../application/use-case/project-usecase/delete-project-usecase";


/**
 * cannot delete a project if it is in deleted state.
 */
describe("Delete Project", () => {
    test('cannot delete a project if it is in deleted state',()=>{
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false); //0 active tasks
        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.delete(false)).toThrow("Project is deleted");
    })
})

/**
 * cannot delete a project if it has active tasks.
 */
describe("Delete Project", () => {
    test('cannot delete a project if it has active tasks',()=>{
        const project = ProjectDomain.create("Test Project", "123");

        //action and assertions
        expect(()=>project.delete(true)).toThrow("Project cannot be deleted as it contains active tasks");
    })
})