import CommentDomain from "../../../domains/operational/comment/comment";

class InMemoryCommentRepository {
    private store: Map<string, InstanceType<typeof CommentDomain>>;
    constructor(){
        this.store = new Map();
    }
    async save(comment: InstanceType<typeof CommentDomain>): Promise<void> {
        this.store.set(comment["props"].id, comment);
        return Promise.resolve();
    }
    async findById(id: string): Promise<InstanceType<typeof CommentDomain> | null> {
        return this.store.get(id) || null;
    }
    public getAllCommentIds(): string[] {
        return Array.from(this.store.keys());
    }
}
export default InMemoryCommentRepository;