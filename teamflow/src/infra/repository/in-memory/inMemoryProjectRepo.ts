import type { SrvRecord } from "node:dns";
import ProjectDomain from "../../../domains/operational/project/project";

class InMemoryProjectRepo {
    private store: Map<string, InstanceType<typeof ProjectDomain>>;
    constructor() {
        this.store = new Map();
    }
    async findById(id: string): Promise<InstanceType<typeof ProjectDomain> | null> {
        return this.store.get(id) || null;
    }

    async save(project: InstanceType<typeof ProjectDomain>): Promise<void> {
        this.store.set(project["props"].id, project);
        return Promise.resolve();
    }
    getAllPorjectIds():string[]{
        return Array.from(this.store.keys());
    }
}

export default InMemoryProjectRepo;