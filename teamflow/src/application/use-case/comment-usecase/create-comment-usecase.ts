const CommentDomain = require('../../../domains/operational/comment/comment');
const { v4: uuidv4 } = require('uuid');
const EventDispatcher = require('../../event-dispatcher/eventDispatcher');
type createCommentUseCaseCommand={
    content:string;
    taskId?:string | null;
    projectId?:string | null;
    authorId:string;
}

interface createCommentUseCaseRepository{
    save(comment:InstanceType<typeof CommentDomain>):Promise<void>;
}

class CreateCommentUseCase{
    constructor(
        private createCommentUseCaseRepository:createCommentUseCaseRepository
    ){}
    public async execute(command:createCommentUseCaseCommand):Promise<void>{
        try {

            if((!command.taskId && !command.projectId)||(command.taskId && command.projectId)){
                throw new Error('Comment must be associated with either a task or a project');
            }
            const comment=CommentDomain.create({
                id:uuidv4(),
                content:command.content,
                taskId:command.taskId,
                projectId:command.projectId,
                authorId:command.authorId,
               
            })
            await this.createCommentUseCaseRepository.save(comment);

            //publishing the events;
           EventDispatcher.from(comment);
        } catch (error) {
            const errorMessage =`Failed to create comment with content ${command.content} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}

module.exports = CreateCommentUseCase;