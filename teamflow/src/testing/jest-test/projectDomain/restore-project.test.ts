import ProjectDomain
 from "../../../domains/operational/project/project";
 import eventBus
  from "../../../domains/observability/domainEvent/eventBus";
import RestoreProjectUseCase from "../../../application/use-case/project-usecase/restore-project-usecase";


/**
 * to restore the project project must not be in deleted state.
 * 
 */
describe("Restore Project", () => {
    test("should not restore the project if it is in deleted state", () => {
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false);

        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.restore()).toThrow("Project is deleted");
    })
})