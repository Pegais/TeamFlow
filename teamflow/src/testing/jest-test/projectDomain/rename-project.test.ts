import ProjectDomain from "../../../domains/operational/project/project";
import eventBus from "../../../domains/observability/domainEvent/eventBus";
import RenameProjectUseCase from "../../../application/use-case/project-usecase/rename-project-usecase";


/**
 * to rename a project , project must not be deleted.
 */
describe('renaming a project',()=>{
    test('cannot rename a deleted project',()=>{
        //setup
        let projectName = 'test project';
        let workspaceId = 'workspace-1';
        let project = ProjectDomain.create(projectName,workspaceId);
        project.delete(false);
        //action and assertion
        expect(() => project.rename('new project name')).toThrow('Project is deleted');
    })
})

/**
 * to rename a project , project must have a name.
 */
describe('renaming a project',()=>{
    test('project must have a name',()=>{
        //setup
        let projectName = 'test project';
        let workspaceId = 'workspace-1';
        let project = ProjectDomain.create(projectName,workspaceId);
        //action and assertion
        expect(() => project.rename('')).toThrow('Project name is required');
    })
})
