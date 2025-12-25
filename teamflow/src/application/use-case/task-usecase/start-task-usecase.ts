import TaskDomain from '../../../domains/operational/task/task';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type startTaskUseCaseCommand={
    taskId:string;//id of the task;
}


//note this interface can be used with infra layer for db operations.
interface startTaskUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof TaskDomain> | null>;
    save(task:InstanceType<typeof TaskDomain>):Promise<void>;
}


class StartTaskUseCase{
    constructor(
        private taskRepository:startTaskUseCaseRepository
    ){}
    public async execute(command:startTaskUseCaseCommand):Promise<void>{
        try {
            //loading the entity;
            const task=await this.taskRepository.findById(command.taskId);
            if(!task){
                throw new Error(`Task with id ${command.taskId} not found`);
            }
            //starting the task;
            task.start();
            await this.taskRepository.save(task);
            //publishing the events;
           EventDispatcher.from(task);
        } catch (error) {
            const errorMessage =`Failed to start task with id ${command.taskId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
            
        }
    }
}

export default StartTaskUseCase;