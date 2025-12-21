const TaskDomain = require('../../../domains/operational/task/task');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');
const { v4: uuidv4 } = require('uuid');

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
            const events=task.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to create task with title ${command.title} because of ${error}`;
            throw new Error(errorMessage);
        }
    }
}

module.exports = CreateTaskUseCase;