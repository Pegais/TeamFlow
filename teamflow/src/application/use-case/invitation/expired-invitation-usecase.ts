import InvitationDomain from '../../../domains/lifecycle/invitation/invitation';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type expiredInvitationUseCaseCommand={
    invitationId: string;
}


interface expiredInvitationUseCaseRepository{
    findByInvitationId(id:string):Promise<InstanceType<typeof InvitationDomain> | null>;
    save(invitation:InstanceType<typeof InvitationDomain>):Promise<void>;
}


class ExpiredInvitationUseCase{
    constructor(private expiredInvitationUseCaseRepository: expiredInvitationUseCaseRepository){};
    public async execute(command: expiredInvitationUseCaseCommand): Promise<void>{
        try {
            const invitation=await this.expiredInvitationUseCaseRepository.findByInvitationId(command.invitationId);
            if(!invitation){
                throw new Error(`Invitation with id ${command.invitationId} not found`);
            }
            //expiring invitation;
            invitation.expire();
            await this.expiredInvitationUseCaseRepository.save(invitation);
            //publishing events;
           await EventDispatcher.from(invitation);
        } catch (error) {
            const errorMessage =`Failed to expire invitation with id ${command.invitationId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}

export default ExpiredInvitationUseCase;