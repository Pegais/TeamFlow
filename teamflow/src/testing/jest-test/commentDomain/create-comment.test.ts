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