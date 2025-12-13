//workspace domain
// Very important to imagine it as entity .
// it has its porperties, its rules and its invariants.
//INvariants : are things that should always be true for the entity.


//deciding the invariants:
// 1. A workspace has a name.
// 2. A workspace has a description.
// 3. A workspace has a creator.
// 4. A workspace has a createdAt date.
// 5. A workspace has a updatedAt date.
// 6. A workspace has a deletedAt date.
// 7. A workspace has a users with thier roles.
// 8. A workspace has a tasks.
// 9. A workspace has a projects.
//10. maximum number of users in a workspace is 20.
//11.minimum number of users in a workspace is 2.

//deciding the operations :
//1. we can create a workspace.
//2.we can add user to workspace only when the my role is owner or team head.
//3.we can remove user from workspace only when the my role is owner or team head.
//4.we can add user to workspace only when the user is not already in the workspace and limit is not reached.
//5.anyone can update the workspace name and description.
//6.can delete the workspace only when the my role is owner.
//we can create and add task to workspace (anyone).
//assiging the task to user only owner or team head.

//what should not be allowed in this domain :
//1.cannot add user to workspace if the limit is reached.
//2. cannot remove or delete task if it is assigned to a user.
//3. cannot delete workspace if it has tasks assigned to it.

