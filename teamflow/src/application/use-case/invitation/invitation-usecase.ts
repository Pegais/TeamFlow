const InvitationDomain = require('../../../domains/lifecycle/invitation/invitation');
const eventBus = require('../../../domains/observability/domainEvent/eventBus');
import type { WorkspaceRole } from '../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace.types';
const { v4: uuidv4 } = require('uuid');

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
            // Calculate expiration date (default 7 days)
            const expiresAt = new Date();
            

            const invitation = InvitationDomain.create({
                id: uuidv4(),
                email: command.email,
                role: command.role,
                workspaceId: command.workspaceId,
                expiresAt,
                acceptedAt: null,
                revokedAt: null,
            });
            //saving the invitation entity;
            await this.createInvitationUseCaseRepository.save(invitation);
            //publishing the events;
            const events = invitation.pullEvents();
            for (const event of events) {
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to create invitation for email ${command.email} and workspace with id ${command.workspaceId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}
module.exports = CreateInvitationUseCase;