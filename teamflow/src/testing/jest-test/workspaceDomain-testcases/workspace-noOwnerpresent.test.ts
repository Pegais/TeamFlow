import WorkspaceDomain from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace';

/**
 * Testing for only onwner to add member to workspace.
 */
describe('attacker trying to add member',()=>{
     test('should not add member to workspace',()=>{
        //setup
        const attackerid = 'user-3';
        const ownerid = 'user-1';
        const memberid = 'user-2';
        const role = 'member';
        const worspacename='workspace-1';
        const workspaceDescription='workspace-description-1';
        const workspace = WorkspaceDomain.create(ownerid,worspacename,workspaceDescription);

        
        //assertion to throw error
        expect(()=>{
            workspace.addMember(attackerid,memberid,role);
        }).toThrow('Only Owner can perform this action');

     })
})