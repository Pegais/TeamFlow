
import WorkspaceDomain from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type deleteWorkspaceCommand = {
    readonly workspaceId: string;
    readonly actorId: string; //who is performing the action
    readonly hasActiveTasks: boolean; //whether the workspace has active tasks
}



interface workspaceRepository {
    findById(id: string): Promise<InstanceType<typeof WorkspaceDomain> | null>;
    save(workspace: InstanceType<typeof WorkspaceDomain>): Promise<void>;

}


class DeleteWorkspaceUseCase {
    constructor(
        private readonly workspaceRepository: workspaceRepository
    ){}

    public async execute(command: deleteWorkspaceCommand): Promise<void> {
        try {
            //load aggregate
            const workspace = await this.workspaceRepository.findById(command.workspaceId);
            if(!workspace){
                throw new Error("Workspace not found");
            }
            workspace.deleteWorkspace(command.actorId, command.hasActiveTasks);

            
            
            
            //save and persist the workspace
            await this.workspaceRepository.save(workspace);
            //load all events from the delete event stream
           await EventDispatcher.from(workspace);
          
        } catch (error) {
            const errorMessage = `error from delete workspace usecase : ${error}`;
            throw new Error(errorMessage);
        }
    }
}

export default DeleteWorkspaceUseCase;