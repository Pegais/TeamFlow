


import WorkspaceDomain from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace';
/**
 * Test to check the creation of a workspace
 * Assumptions: the workspace has atleast one owner to be valid workspace.
 */

describe('workspace creation test',()=>{
 
   test('should create a workspace',()=>{
    //setup
   const ownerid ='user-1'
   //action
   const workspace=WorkspaceDomain.create(ownerid,'workspace-1','description-1')

   //assertion
   const member =workspace['props'].members
   expect(member.length).toBe(1);
   })
});