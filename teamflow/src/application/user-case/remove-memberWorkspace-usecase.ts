import type { WorkspaceRole } from '../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace.types';
const WorkspaceDomain = require('../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace');
const eventBus = require('../../domains/observability/domainEvent/eventBus');



type removeWorkspaceMemberCommand = {
    readonly workspaceId: string;
    readonly actorId: string     //who is performing the action
    readonly userId: string;     //who is being removed from the workspace

}

interface workspaceRepository {
    findById(id: string): Promise<InstanceType<typeof WorkspaceDomain> | null>;
    save(workspace: InstanceType<typeof WorkspaceDomain>): Promise<void>;
}


class RemoveWorkspaceMemberUseCase {
    constructor(
        private readonly workspaceRepository: workspaceRepository
    ) { }

    public async execute(command: removeWorkspaceMemberCommand): Promise<void> {

        //load aggregate
        try {
            const workspace = await this.workspaceRepository.findById(command.workspaceId);
            if (!workspace) {
                throw new Error('Workspace not found');
            }

            //remove member from workspace
            workspace.removeMember(command.actorId, command.userId);

            
            //publish the events
            //events must be published before the aggregate is saved to the repository to avoid race conditions.
            const events = workspace.pullEvents();
            for (const event of events) {
                eventBus.publish(event);
            }
            //persist the aggregate
            await this.workspaceRepository.save(workspace);
        } catch (error) {
            const errorMeessage = `error from remove member workspace usecase : ${error}`;
            throw new Error(errorMeessage);


        }
    }
}

module.exports = RemoveWorkspaceMemberUseCase;