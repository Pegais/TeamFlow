import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import ArchiveProjectUseCase from "../../../application/use-case/project-usecase/archive-project-usecase";


/**
 * check for correct archive flow.
 */
describe("Archive Project", () => {
    test('archive a project',()=>{
        const project = ProjectDomain.create("Test Project", "123");

        //archive the project
        project.archive();

        //assertions
        expect(project['props'].status).toBe("archived");
    })
})

/**
 * cannot archive a project if it is in deleted state.
 */
describe("Archive Project", () => {
    test('cannot archive a project if it is in deleted state',()=>{
        const project = ProjectDomain.create("Test Project", "123");
        project.delete(false); //0 active tasks

        //assertions
        expect(project['props'].status).toBe("deleted");
        expect(()=>project.archive()).toThrow("Project is deleted");
    })
})