import registerSubscribers from "../event-Subscribers/registerSubscriber";

registerSubscribers();

console.log("Teamflow is running");

//create repository
import inMemoryWorkspaceRepository from "../../infra/repository/in-memory/inMemoryWorkspaceRepo"
import inMemorrProjectRepository from "../../infra/repository/in-memory/inMemoryProjectRepo"
import inMemoryTaskRepository from "../../infra/repository/in-memory/inMemoryTaskrepo"

const workspaceRepository = new inMemoryWorkspaceRepository();
const projectRepository = new inMemorrProjectRepository();
const taskRepository = new inMemoryTaskRepository();

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

export const workspace= {
    
        addWorkspaceMember: addWorkspaceMemberUseCase,
        removeWorkspaceMember: removeWorkspaceMemberUseCase,
        deleteWorkspace: deleteWorkspaceUseCase,

           
}
export const project= {
        createProject: createProjectUseCase,
        archiveProject: archiveProjectUseCase,
        addTaskToProject: addTaskToProjectUseCase,
}
export{workspaceRepository, projectRepository, taskRepository};