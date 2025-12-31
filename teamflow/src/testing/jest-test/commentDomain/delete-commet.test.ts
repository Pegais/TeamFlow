import CommentDomain from "../../../domains/operational/comment/comment";
import DeleteCommentUseCase from "../../../application/use-case/comment-usecase/delete-comment-usecase";
import eventBus from "../../../domains/observability/domainEvent/eventBus";


/**
 * deleting a comment should emit COMMENT_DELETED event.
 */
class FakeCommentRepository{
    private comments:CommentDomain[]=[];
    constructor(private comment:CommentDomain){
        this.comments=[this.comment];
    }
    public async save(comment:CommentDomain):Promise<void>{
        this.comments.push(comment);
        console.log(`Comment saved: ${comment["props"].id}`);
        return Promise.resolve();
    }
    public async findById(id:string):Promise<CommentDomain | null>{
        const comment = this.comments.find(comment => comment["props"].id === id);
        if(!comment){
            return null;
        }
        return comment;
    }
}

class fakeSubscriber{
    handler(event:any):Promise<void>{
        console.log(`Event received: ${event.type}`);
        return Promise.resolve();
    }
}

describe("deleteComment", () => {
    test('should emit COMMENT_DELETED event', async () => {
        //setup
        const comment = CommentDomain.create({
            id:"123",
            content:"this is a test comment",
            taskId:null,
            projectId:"project-1",
            authorId:"456",
            createdAt:new Date(),
            updatedAt:new Date(),
            deletedAt:null,
        });
        const fakeCommentRepository = new FakeCommentRepository(comment);
        const subscriber = new fakeSubscriber();
        //event asubscription
        let capturedEvent:any=null;
        eventBus.subscribe("COMMENT_DELETED",async(event:any)=>{
            capturedEvent=event;
            await subscriber.handler(event);
        });
        const deleteCommentUseCase = new DeleteCommentUseCase(fakeCommentRepository);
        await deleteCommentUseCase.execute({
            commentId:"123",
        });

        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent.type).toBe("COMMENT_DELETED");
    })
})