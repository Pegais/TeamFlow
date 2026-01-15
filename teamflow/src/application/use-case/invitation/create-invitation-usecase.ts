import InvitationDomain from "../../../domains/lifecycle/invitation/invitation";
import type workspaceTypes = require("../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace.types");
import { v4 as uuidv4 } from 'uuid';
import EventDispatcher from "../../event-dispatcher/eventDispatcher";
type createInvitationUseCaseCommand = {

    email: string;
    role: workspaceTypes.WorkspaceRole;
    workspaceId: string;
    expiresAt?: Date;

}

interface createInvitationUseCaseRepository {
    save(invitation: InstanceType<typeof InvitationDomain>): Promise<void>;
}

class CreateInvitationUseCase {
    private invitationRepository: createInvitationUseCaseRepository;
    constructor(invitationRepository: createInvitationUseCaseRepository) {
        this.invitationRepository = invitationRepository;
    }
    public async execute(command: createInvitationUseCaseCommand): Promise<void> {
        try {
            const expiresAt = command.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
            const invitation = InvitationDomain.create({
                id: uuidv4(),
                email: command.email,
                role: command.role,
                workspaceId: command.workspaceId,
                status: "pending",
                expiresAt: expiresAt,
                acceptedAt: null,
                revokedAt: null,
                createdAt: new Date(),
            });
            await this.invitationRepository.save(invitation);
            //publishing the event
            await EventDispatcher.from(invitation);
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to create invitation: ${error}`);
        }
    }
}

export default CreateInvitationUseCase;