import InvitationDomain from '../../../domains/lifecycle/invitation/invitation';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type acceptInvitationUseCaseCommand = {
    invitationId: string;
}

interface acceptInvitationUseCaseRepository {
    findByInvitationId(id: string): Promise<InstanceType<typeof InvitationDomain> | null>;
    save(invitation: InstanceType<typeof InvitationDomain>): Promise<void>;
}

class AcceptInvitationUseCase{
    constructor(
        private acceptInvitationUseCaseRepository: acceptInvitationUseCaseRepository
    ){}
    public async execute(command: acceptInvitationUseCaseCommand): Promise<void>{
        try {
            const invitation=await this.acceptInvitationUseCaseRepository.findByInvitationId(command.invitationId);
            if(!invitation){
                throw new Error(`Invitation with id ${command.invitationId} not found`);
            }
            //accepting the invitation;
            invitation.accept();
            await this.acceptInvitationUseCaseRepository.save(invitation);
            //publishing the events;
            await EventDispatcher.from(invitation);
        } catch (error) {
            const errorMessage =`Failed to accept invitation with id ${command.invitationId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}
export default AcceptInvitationUseCase;