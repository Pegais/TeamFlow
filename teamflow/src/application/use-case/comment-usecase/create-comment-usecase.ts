import CommentDomain from '../../../domains/operational/comment/comment';
import { v4 as uuidv4 } from 'uuid';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type createCommentUseCaseCommand={
    content:string | undefined;
    taskId:string | null;
    projectId:string | null;
    authorId:string | undefined;
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
                throw new Error('Comment must be associated with either a task or a project but not both');
            }
            const comment=CommentDomain.create({
                id:uuidv4(),
                content:command.content,
                taskId:command.taskId,
                projectId:command.projectId,
                authorId:command.authorId,
                createdAt:new Date(),
                updatedAt:new Date(),
                deletedAt:null,
            })
            await this.createCommentUseCaseRepository.save(comment);

            //publishing the events;
           await EventDispatcher.from(comment);
        } catch (error) {
            const errorMessage =`Failed to create comment with content ${command.content} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}

export default CreateCommentUseCase;