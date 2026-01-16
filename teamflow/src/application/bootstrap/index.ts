import registerSubscribers from "../event-Subscribers/registerSubscriber";

registerSubscribers();

console.log("Teamflow is running");

//create repository
import inMemoryWorkspaceRepository from "../../infra/repository/in-memory/inMemoryWorkspaceRepo"
import inMemorrProjectRepository from "../../infra/repository/in-memory/inMemoryProjectRepo"
import inMemoryTaskRepository from "../../infra/repository/in-memory/inMemoryTaskrepo"
import inMemoryInvitationRepository from "../../infra/repository/in-memory/inMemoryInvitationrepo"
const workspaceRepository = new inMemoryWorkspaceRepository();
const projectRepository = new inMemorrProjectRepository();
const taskRepository = new inMemoryTaskRepository();
const invitationRepository = new inMemoryInvitationRepository();
//creating use cases
import AddWorkspaceMemberUseCase from "../use-case/workspace-usecase/add-memberWorkspace-usecase";
import RemoveWorkspaceMemberUseCase from "../use-case/workspace-usecase/remove-memberWorkspace-usecase";
import DeleteWorkspaceUseCase from "../use-case/workspace-usecase/delete-workspace-usecase";

//creating project use cases
import CreateProjectUseCase from "../use-case/project-usecase/create-project-usecase";
import ArchiveProjectUseCase from "../use-case/project-usecase/archive-project-usecase";
import DeleteProjectUseCase from "../use-case/project-usecase/delete-project-usecase";
import AddTaskToProjectUseCase from "../use-case/project-usecase/addTask-project-usecase";
import RemoveTaskFromProjectUseCase from "../use-case/project-usecase/removeTask-project-usecase";
import RenameProjectUseCase from "../use-case/project-usecase/rename-project-usecase";
import RestoreProjectUseCase from "../use-case/project-usecase/restore-project-usecase";
const addWorkspaceMemberUseCase = new AddWorkspaceMemberUseCase(workspaceRepository);
//remove workspace member use case
const removeWorkspaceMemberUseCase = new RemoveWorkspaceMemberUseCase(workspaceRepository);

//delete workspace use case
const deleteWorkspaceUseCase = new DeleteWorkspaceUseCase(workspaceRepository);


//creating project use cases instances
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
//archive project use case
const archiveProjectUseCase = new ArchiveProjectUseCase(projectRepository);
//create new task project use case
const addTaskToProjectUseCase = new AddTaskToProjectUseCase(projectRepository);
//delete project use case
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);
//rename project use case
const renameProjectUseCase = new RenameProjectUseCase(projectRepository);
//restore project use case
const restoreProjectUseCase = new RestoreProjectUseCase(projectRepository);
//remove task from project use case
const removeTaskFromProjectUseCase = new RemoveTaskFromProjectUseCase(projectRepository);

//tasks
import CreateTaskUseCase from "../use-case/task-usecase/create-task-usecase";
import StartTaskUseCase from "../use-case/task-usecase/start-task-usecase";
import CompleteTaskUseCase from "../use-case/task-usecase/complete-task-usecase";

//creating task use cases instances
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const startTaskUseCase = new StartTaskUseCase(taskRepository);
const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);


//invitation use cases
import AcceptInvitationUseCase from "../use-case/invitation/accept-invitation-usecase";
import CreateInvitationUseCase from "../use-case/invitation/create-invitation-usecase";
import RevokeInvitationUseCase from "../use-case/invitation/revoke-invitation-usecase";
import ExpiredInvitationUseCase from "../use-case/invitation/expired-invitation-usecase";
const acceptInvitationUseCase = new AcceptInvitationUseCase(invitationRepository);
const createInvitationUseCase = new CreateInvitationUseCase(invitationRepository);
const revokeInvitationUseCase = new RevokeInvitationUseCase(invitationRepository);
const expiredInvitationUseCase = new ExpiredInvitationUseCase(invitationRepository);

//Comment
import CommentDomain from "../../domains/operational/comment/comment";
import InMemoryCommentRepository from "../../infra/repository/in-memory/inMemoryCommentRepo";
const commentRepository = new InMemoryCommentRepository();

//Comment use cases
import CreateCommentUseCase from "../use-case/comment-usecase/create-comment-usecase";
import EditContentUseCase from "../use-case/comment-usecase/edit-content-usecase";
import DeleteCommentUseCase from "../use-case/comment-usecase/delete-comment-usecase";
const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const editContentUseCase = new EditContentUseCase(commentRepository);
const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);


//Comment use cases instances
export const comment= {
    createComment: createCommentUseCase,
    
}

//invitation use cases instances
export const invitation= {
    acceptInvitation: acceptInvitationUseCase,
    createInvitation: createInvitationUseCase,
    revokeInvitation: revokeInvitationUseCase,
    expiredInvitation: expiredInvitationUseCase,
}

//tasks
export const task= {
    createTask: createTaskUseCase,
    startTask: startTaskUseCase,
    completeTask: completeTaskUseCase,
}

export const workspace= {
    
        addWorkspaceMember: addWorkspaceMemberUseCase,
        removeWorkspaceMember: removeWorkspaceMemberUseCase,
        deleteWorkspace: deleteWorkspaceUseCase,

           
}
export const project= {
        createProject: createProjectUseCase,
        archiveProject: archiveProjectUseCase,
        addTaskToProject: addTaskToProjectUseCase,
        deleteProject: deleteProjectUseCase,
        renameProject: renameProjectUseCase,
        restoreProject: restoreProjectUseCase,
        removeTaskFromProject: removeTaskFromProjectUseCase,
}
export{workspaceRepository, projectRepository, taskRepository, invitationRepository, commentRepository};