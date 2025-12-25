//Business flow for this usecase :

/**
 * Load workspace aggregate root.
 * Call domain method to add member.
 * Persist workspace (commit state first).
 * Pull emitted domain events.
 * Publish events via event bus (only after successful save).
 */

/**
 * Remember : application layer do not validate the rules;
 * it trusts the domain.
 */

//defining the command object, in DDD we dont pass raw params we give commands.
import type { WorkspaceRole } from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace.types';
import WorkspaceDomain from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';

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
    private workspaceRepository: workspaceRepository
    constructor(
        workspaceRepository: workspaceRepository
    ) { 
        this.workspaceRepository = workspaceRepository;
    }

    //public method to add member to workspace
    public async execute(command: AddWorkspaceMemberCommand): Promise<void> {
        try {
            //load workspace aggregate root
        const workspace = await this.workspaceRepository.findById(command.workspaceId);
        console.log('workspace:', workspace);
        
        if (!workspace) {
            throw new Error('Workspace not found');
        }
        //call domain method to add member
        workspace.addMember(command.actorId, command.userId, command.role);
        //save workspace
       await this.workspaceRepository.save(workspace);
       //pull emmitted domain events
    await EventDispatcher.from(workspace);
        } catch (error) {
            const errorMessage = `error from add member workspace usecase : ${error}`;
            throw new Error(errorMessage);
        }

    }
}

export default AddWorkspaceMemberUseCase;