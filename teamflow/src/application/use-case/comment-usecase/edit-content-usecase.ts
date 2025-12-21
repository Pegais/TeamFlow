const CommentDomain = require('../../../domains/operational/comment/comment');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');


type editContentUseCaseCommand={
    commentId:string;
    newContent:string;
}

interface editContentUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof CommentDomain> | null>;
    save(comment:InstanceType<typeof CommentDomain>):Promise<void>;
}
class EditContentUseCase{
    constructor(
        private editContentUseCaseRepository:editContentUseCaseRepository
    ){}
    public async execute(command:editContentUseCaseCommand):Promise<void>{
        try {
            
            //loading the entity;
            const comment =await this.editContentUseCaseRepository.findById(command.commentId);
            if(!comment){
                throw new Error(`Comment with id ${command.commentId} not found`);
            }
            //editing the content;
            comment.edit(command.newContent);
            await this.editContentUseCaseRepository.save(comment);
            //publishing the events;
            const events=comment.pullEvents();

            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to edit content of comment with id ${command.commentId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}

module.exports = EditContentUseCase;