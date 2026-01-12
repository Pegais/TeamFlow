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


const addWorkspaceMemberUseCase = new AddWorkspaceMemberUseCase(workspaceRepository);


export const workspace= {
    
        addWorkspaceMember: addWorkspaceMemberUseCase,
    
}
export{workspaceRepository, projectRepository, taskRepository};