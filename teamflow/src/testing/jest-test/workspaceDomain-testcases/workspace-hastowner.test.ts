import WorkspaceDomain from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace';

describe('workspace has atleast one owner', () => {
    test('should create a workspace with atleast one owner', () => {
        //setup
        const ownerid = 'user-1'
        //action
        const workspace = WorkspaceDomain.create(ownerid, 'workspace-1', 'description-1')
        //assertion
        expect(workspace['props'].userids.length).toBe(1)
        expect(workspace['props'].userids[0]).toBe(ownerid)
        expect(workspace['props'].members[0]?.role).toBe('owner')
    })
});