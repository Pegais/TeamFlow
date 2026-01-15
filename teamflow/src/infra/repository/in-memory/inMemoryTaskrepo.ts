import TaskDomain from "../../../domains/operational/task/task";

class InMemoryTaskRepo {
    private store: Map<string, InstanceType<typeof TaskDomain>>;
    constructor() {
        this.store = new Map();
    }

    async findById(id: string): Promise<InstanceType<typeof TaskDomain> | null> {
        return this.store.get(id) || null;
    }

    async save(task: InstanceType<typeof TaskDomain>): Promise<void> {
        this.store.set(task["props"].id, task);
        return Promise.resolve();
    }
    getAllTaskIds(): string[] {
        return Array.from(this.store.keys());
    }
}

export default InMemoryTaskRepo;