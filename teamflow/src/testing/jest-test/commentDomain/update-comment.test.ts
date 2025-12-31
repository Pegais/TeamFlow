/**
 * updating a comment should emit COMMENT_UPDATED event.
 */
/**
 * comment should not be deleted before updating.
 */

import CommentDomain from "../../../domains/operational/comment/comment";

describe("update deleted comment", () => {
    test('should throw error if comment is deleted', () => {
        //action and assertions
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
        comment.delete();
        expect(() => comment.edit("this is a new comment")).toThrow("Comment is deleted and cannot be mutated");
    })
})


/**
 * editing comment should emit COMMENT_UPDATED event.
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

import eventBus from "../../../domains/observability/domainEvent/eventBus";
import EditContentUseCase from "../../../application/use-case/comment-usecase/edit-content-usecase";

describe("updateComment", () => {
    test('should emit COMMENT_UPDATED event', async () => {
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
        eventBus.subscribe("COMMENT_UPDATED",async(event:any)=>{
            capturedEvent=event;
            await subscriber.handler(event);
        });
        const editContentUseCase = new EditContentUseCase(fakeCommentRepository);
        await editContentUseCase.execute({
            commentId:"123",
            newContent:"this is a new comment",
        });
        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent.type).toBe("COMMENT_UPDATED");
    })
})