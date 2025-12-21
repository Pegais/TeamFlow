const InvitationDomain = require('../../../domains/lifecycle/invitation/invitation');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');

type revokeInvitationUseCaseCommand={
    invitationId: string;
}

interface revokeInvitationUseCaseRepository{
    findByInvitationId(id:string):Promise<InstanceType<typeof InvitationDomain> | null>;
    save(invitation:InstanceType<typeof InvitationDomain>):Promise<void>;
}

class RevokeInvitationUseCase{
    
    constructor(private revokeInvitationUseCaseRepository: revokeInvitationUseCaseRepository){};
    public async execute(command: revokeInvitationUseCaseCommand): Promise<void>{
        try {
            //loading invitation entity;
            const invitation=await this.revokeInvitationUseCaseRepository.findByInvitationId(command.invitationId);
            if(!invitation){
                throw new Error(`Invitation with id ${command.invitationId} not found`);
            }
            //revoking invitation;
            invitation.revoke();
            await this.revokeInvitationUseCaseRepository.save(invitation);
            //publishing events;
            const events=invitation.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to revoke invitation with id ${command.invitationId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}
module.exports = RevokeInvitationUseCase;