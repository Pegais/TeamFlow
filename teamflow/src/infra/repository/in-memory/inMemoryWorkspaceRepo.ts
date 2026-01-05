import WorkspaceDomain from "../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace";


class InMemoryWorkspaceRepo {
    private store: Map<string, InstanceType<typeof WorkspaceDomain>>;
    constructor() {
        this.store = new Map();
    }

    async findById(id: string): Promise<WorkspaceDomain | null> {
        return this.store.get(id) || null;
    }

    async save(workspace: InstanceType<typeof WorkspaceDomain>): Promise<void> {
        this.store.set(workspace["props"].id, workspace);
        return Promise.resolve();
    }

}

export default InMemoryWorkspaceRepo;