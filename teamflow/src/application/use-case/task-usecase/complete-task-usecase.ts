const TaskDomain = require('../../../domains/operational/task/task');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');


type completeTaskUseCaseCommand={
    taskId:string;//id of the task;
}

interface completeTaskUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof TaskDomain> | null>;
    save(task:InstanceType<typeof TaskDomain>):Promise<void>;
}

class CompleteTaskUseCase{
    constructor(private completeTaskUseCaseRepository:completeTaskUseCaseRepository){}
    public async execute(command:completeTaskUseCaseCommand):Promise<void>{
        try {
            //loading the entity;
            const task=await this.completeTaskUseCaseRepository.findById(command.taskId);
            if(!task){
                throw new Error(`Task with id ${command.taskId} not found`);
            }
            //completing the task;
            task.complete();
            await this.completeTaskUseCaseRepository.save(task);
            //publishing the events;
            const events=task.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to complete task with id ${command.taskId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}

module.exports = CompleteTaskUseCase;