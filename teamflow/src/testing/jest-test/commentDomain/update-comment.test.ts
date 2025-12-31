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
