import InvitationDomain from "../../../domains/lifecycle/invitation/invitation";


class InMemoryInvitationRepository {
    private store: Map<string, InvitationDomain>;
    constructor() {
        this.store = new Map();
    }

    async save(invitation: InvitationDomain): Promise<void> {
        this.store.set(invitation["props"].id, invitation);
        return Promise.resolve();
    }

    async findByInvitationId(id: string): Promise<InstanceType<typeof InvitationDomain> | null> {
        return this.store.get(id) || null;
    }

    public getAllInvitationIds(): string[] {
        return Array.from(this.store.keys());
    }
}
export default InMemoryInvitationRepository;