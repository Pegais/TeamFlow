const CommentDomain = require('../../../domains/operational/comment/comment');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');

type deleteCommentUseCaseCommand={
    commentId:string;
}

interface deleteCommentUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof CommentDomain> | null>;
    save(comment:InstanceType<typeof CommentDomain>):Promise<void>;
}
class DeleteCommentUseCase{
    constructor(
        private deleteCommentUseCaseRepository:deleteCommentUseCaseRepository
    ){}
    public async execute(command:deleteCommentUseCaseCommand):Promise<void>{
        try {
            //loading the entity;
            const comment =await this.deleteCommentUseCaseRepository.findById(command.commentId);
            if(!comment){
                throw new Error(`Comment with id ${command.commentId} not found`);
            }
            //deleting the comment;
            comment.delete();
            await this.deleteCommentUseCaseRepository.save(comment);
            //publishing the events;
            const events=comment.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to delete comment with id ${command.commentId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}

module.exports = DeleteCommentUseCase;