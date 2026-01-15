import { workspace,workspaceRepository ,project,projectRepository,
    task,taskRepository,invitation,invitationRepository} from "./index";
import WorkspaceDomain from "../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace";
import InvitationDomain from "../../domains/lifecycle/invitation/invitation";
async function main() {
    console.log("Starting the application");
    //create a workspace
    const newWorkspace = WorkspaceDomain.create("owner-1", "Test Workspace", "Test Description");
   //save the created workspace to the repository
   await workspaceRepository.save(newWorkspace);
   console.log("Workspace saved:", newWorkspace["props"].id);
   //add a member to the workspace
    try {
        await workspace.addWorkspaceMember.execute({
            workspaceId: newWorkspace["props"].id,
            userId: "456",
            role: "member",
            actorId: "owner-1"
        });
        console.log("Member added to workspace successfully...");
        await workspace.removeWorkspaceMember.execute({
            workspaceId: newWorkspace["props"].id,
            userId: "456",
            actorId: "owner-1"
        });
        console.log("Member removed from workspace successfully...");
        await workspace.deleteWorkspace.execute({
            workspaceId: newWorkspace["props"].id,
            actorId: "owner-1",
            hasActiveTasks: false
        });
        console.log("Workspace deleted successfully...");
        //create a project
       await project.createProject.execute({
            name: "Test Project",
            workspaceId: newWorkspace["props"].id
        });
        console.log("Project created successfully...");
        //archive the project
       //get all project ids

       //creating a task and passing it to the project ;
       await task.createTask.execute({
        title: "Test Task",
        description: "Test Description",
        assigneeId: "123"
       });
       console.log("Task created successfully...");
       let taskIds=taskRepository.getAllTaskIds();
       let projectIds=projectRepository.getAllPorjectIds();
       console.log("Project ids:",projectIds);
       //adding task to project
       if(projectIds.length > 0 && taskIds.length > 0){   
       await project.addTaskToProject.execute({
            projectId: projectIds[projectIds.length - 1]!,
            taskId: taskIds[taskIds.length - 1]!
            });
            console.log("Task added to project successfully...");
        }

        //starting the task
        if(taskIds.length > 0){
            await task.startTask.execute({
                taskId: taskIds[taskIds.length - 1]!
            });
            console.log("Task started successfully...");
        }
       //archive the project
       if(projectIds.length > 0){
        await project.archiveProject.execute({
            projectId: projectIds[projectIds.length - 1]!,
            
        });
       }
        console.log("Project archived successfully...");
        //adding a task to acrhived project;
        // await project.addTaskToProject.execute({
        //     projectId: projectIds[projectIds.length - 1]!,
        //     taskId: "123"
        // });
        // console.log("Task added to archived project successfully...");
        //delete the project
        // await project.deleteProject.execute({
        //     projectId: projectIds[projectIds.length - 1]!,
        //     hasActiveTasks: false
        // });
        // console.log("Project deleted successfully...");

        //checking projectids after deletion
        // let projectIdsAfterDeletion=projectRepository.getAllPorjectIds();
        // console.log("Project ids after deletion:",projectIdsAfterDeletion);

        //add task to deleted project
        // if(projectIdsAfterDeletion.length > 0){
        //     await project.addTaskToProject.execute({
        //         projectId: projectIdsAfterDeletion[projectIdsAfterDeletion.length - 1]!,
        //         taskId: "123"
        //     });
        // }
        // console.log("Trying to add task to deleted project...");

        //rename the project
        if(projectIds.length > 0){
            await project.renameProject.execute({
                projectId: projectIds[projectIds.length - 1]!,
                newName: "Test Project 2"
            });
        }
        console.log("Project renamed successfully...");

        //restore the archived project
        if(projectIds.length > 0){
            await project.restoreProject.execute({
                projectId: projectIds[projectIds.length - 1]!,
            });
            console.log("Project restored successfully...");
        }

        //remove task from the project
        if(projectIds.length > 0){
            await project.removeTaskFromProject.execute({
                projectId: projectIds[projectIds.length - 1]!,
                taskId: "123"
            });
            console.log("Task removed from project successfully...");
        }

        //completing the task
        if(taskIds.length > 0){
            await task.completeTask.execute({
                taskId: taskIds[taskIds.length - 1]!
            });
            console.log("Task completed successfully...");
        }


         //creating an invitation
         const newInvitation = InvitationDomain.create({
            id: "123",
            workspaceId: newWorkspace["props"].id,
            email: "test@example.com",
            role: "member",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            status: "pending",
            acceptedAt: null,
            revokedAt: null,
            createdAt: new Date(),
         });
         await invitationRepository.save(newInvitation);
         console.log("Invitation created successfully...");  
         
    } catch (error) {
        console.log(error);

    }
    console.log("Application ended");
}

main();