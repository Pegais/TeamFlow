//defininf the user invariants:
//1.A user has a id,email ,name.
//2.the email is unique and immutable i.e it can not be changed once created.
//3.User has lifecyle of active,suspended,deleted.
//4.deleted user cannot perform any action nor their account can be reactivated.
//5.a suspended user can not perform any action but their account can be reactivated.

import User from "../../../domains/global/user/user";
describe('user should be created with a valid email and name', () => {
    test('should throw error if the email or name is not provided', () => {
        //setup ;
        let email = '';
        let name = 'test user';
        //action
      
        //assertion
       expect(() => User.createUser(email,name)).toThrow('Email and name are required');
    })
})