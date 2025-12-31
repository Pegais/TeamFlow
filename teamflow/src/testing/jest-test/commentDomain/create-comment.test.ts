import CommentDomain from "../../../domains/operational/comment/comment";


/**
 * Test case for creating a comment
 */
describe("createComment", () => {
    it("should create a comment", () => {
    
        //assertions
        //no project id or taskid should be provided
        expect(() => {
            const comment = CommentDomain.create({
                id:"123",
                content:"this is a test comment",
                taskId: null,
                projectId:null,
                authorId:"456",
               createdAt:new Date(),
               updatedAt:new Date(),
               deletedAt:null,
            });
        }).toThrow("Comment must be related to either a task or a project but not both");

        

    });
});

/**
 * creating a comment should emit COMMENT_CREATED event.
 * 
 */
class FakeCommentRepository{
    private comments:CommentDomain[]=[];
   
    public async save(comment:CommentDomain):Promise<void>{
        this.comments.push(comment);
        console.log(`Comment saved`);
        return Promise.resolve();
    }
}

class fakeSubscriber{
    handler(event:any):Promise<void>{
        console.log(`Event received: ${event.type}`);
        return Promise.resolve();
    }
}

import eventBus from "../../../domains/observability/domainEvent/eventBus";
import CreateCommentUseCase
 from "../../../application/use-case/comment-usecase/create-comment-usecase";


 describe("createComment", () => {
    test('should emit COMMENT_CREATED event', async () => {
       
        //actions
        const fakeCommentRepository = new FakeCommentRepository();
        const subscriber = new fakeSubscriber();
        //event asubscription
        let capturedEvent:any=null;
        eventBus.subscribe("COMMENT_CREATED",async(event:any)=>{
            capturedEvent=event;
            await subscriber.handler(event);

        });
        const createCommentUseCase = new CreateCommentUseCase(fakeCommentRepository);
        await createCommentUseCase.execute({
            content:"this is a test comment",
            taskId:"task-1",
            projectId:null,
            authorId:"456",
        });
        //assertions
        expect(capturedEvent).not.toBeNull();
        expect(capturedEvent.type).toBe("COMMENT_CREATED");
    })
 })