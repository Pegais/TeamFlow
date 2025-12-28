import ProjectDomain from "../../../domains/operational/project/project";


//testcase 1: creating a project;
//for a project to be created, a name and workspace id are required.
describe('creating a project', () => {
    test('project must belong to a workspace', () => {
        //setup ;
        let name = 'test project';
        let workspaceId = '';
      
        //action and assertion
        expect(() => ProjectDomain.create(name,workspaceId)).toThrow('Workspace ID is required');
    })
})