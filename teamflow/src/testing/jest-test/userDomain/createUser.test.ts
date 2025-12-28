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

//case 2: suspending a user;
describe('suspending a user', () => {
    test('should throw error if the user is not created', () => {
        //setup ;
        let email = 'test@test.com';
        let name = 'test user';
        //action
      const user = User.createUser(email,name);
      user.deleteUser(email);
        //assertion
        expect(() => user.suspendUser()).toThrow('User is deleted and cannot be modified');
    })
})


//testcase 3 :activating a active user;
//must throw erro as only suspended user can be activated.

describe('activating a active user', () => {
    test('should throw error if the user is already active', () => {
        //setup ;
        let email = 'test@test.com';
        let name = 'test user';
        //action
        const user = User.createUser(email,name);
        
        //assertion
        expect(() => user.activateUser(email)).toThrow('User is not suspended');
    })
})
