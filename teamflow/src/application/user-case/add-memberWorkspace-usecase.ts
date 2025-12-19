//Business flow for this usecase :

/**
 * Load workspace aggregate root.
 * call domain method to add member.
 * pull emmitted domain events.
 * publishing the events via event bus.
 * persist workpace (later)
 */

/**
 * Remember : application layer do not validate the rules;
 * it trusts the domain.
 */

//defining the command object, in DDD we dont pass raw params we give commands.
import type { WorkspaceRole } from '../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace.types';
const WorkspaceDomain = require('../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace');
const eventBus = require('../../domains/observability/domainEvent/eventBus');


type AddWorkspaceMemberCommand = {
    workspaceId: string;
    actorId: string     //who is performing the action
    userId: string;     //who is being added to the workspace
    role: WorkspaceRole;
}

interface workspaceRepository {
    findById(id: string): Promise <InstanceType<typeof WorkspaceDomain> |null>;
    save(workspace: InstanceType<typeof WorkspaceDomain>): Promise<void>;
}


class AddWorkspaceMemberUseCase {
    constructor(
        private workspaceRepository: workspaceRepository
    ) { }

    //public method to add member to workspace
    public async execute(command: AddWorkspaceMemberCommand): Promise<void> {
        //load workspace aggregate root
        const workspace = await this.workspaceRepository.findById(command.workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }
        //call domain method to add member
        await workspace.addMember(command.actorId, command.userId, command.role);
        //pull emmitted domain events
        const events = workspace.pullEvents();
        //publish the events via event bus
        for (const event of events) {
            eventBus.publish(event);
        }
        //save workspace
       await this.workspaceRepository.save(workspace);

    }
}

module.exports = AddWorkspaceMemberUseCase;