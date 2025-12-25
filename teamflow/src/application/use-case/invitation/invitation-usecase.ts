import InvitationDomain from '../../../domains/lifecycle/invitation/invitation';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
import type { WorkspaceRole } from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace.types';
import { v4 as uuidv4 } from 'uuid';

type createinvitationUseCaseCommand = {
    email: string;
    role: WorkspaceRole;
    workspaceId: string;
}

interface createInvitationUseCaseRepository {
    save(invitation: InstanceType<typeof InvitationDomain>): Promise<void>;
}
class CreateInvitationUseCase {
    constructor(
        private createInvitationUseCaseRepository: createInvitationUseCaseRepository
    ) { }

    public async execute(command: createinvitationUseCaseCommand): Promise<void> {
        try {
            //creating the invitation entity;
            const invitation = InvitationDomain.create({
                id: uuidv4(),
                email: command.email,
                role: command.role,
                workspaceId: command.workspaceId,
            });
            //saving the invitation entity;
            await this.createInvitationUseCaseRepository.save(invitation);
            //publishing the events;
          EventDispatcher.from(invitation);
        } catch (error) {
            const errorMessage =`Failed to create invitation for email ${command.email} and workspace with id ${command.workspaceId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}
export default CreateInvitationUseCase;