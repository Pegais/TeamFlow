import TaskDomain from '../../../domains/operational/task/task';
import { v4 as uuidv4 } from 'uuid';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type createTaskUseCaseCommand={
    title: string;
    description?: string;
    assigneeId?: string;
}

interface createTaskUseCaseRepository{
    save(task:InstanceType<typeof TaskDomain>):Promise<void>;
}

class CreateTaskUseCase{
    constructor(
        private taskRepository:createTaskUseCaseRepository
    ){}
    public async execute(command:createTaskUseCaseCommand):Promise<void>{
        try {
            //creating the task using taskdomain constructor and instance.
            const task=new TaskDomain({
                id:uuidv4(),
                title:command.title,
                description:command.description,
                assigneeId:command.assigneeId,
            })
            task.create();

            await this.taskRepository.save(task);

            //publishing the events;
           await EventDispatcher.from(task);
        } catch (error) {
            const errorMessage =`Failed to create task with title ${command.title} because of ${error}`;
            throw new Error(errorMessage);
        }
    }
}

export default CreateTaskUseCase;