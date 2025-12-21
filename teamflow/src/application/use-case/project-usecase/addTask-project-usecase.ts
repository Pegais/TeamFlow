const ProjectDomain = require('../../../domains/operational/project/project');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');

/**
 * creating type command for adding task to project;
 */
type addTaskToProjectUseCaseCommand={
    projectId:string;
    taskId:string;
}

interface addTaskToProjectUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project:InstanceType<typeof ProjectDomain>):Promise<void>;
}

class AddTaskToProjectUseCase{
    constructor(
        private projectRepository:addTaskToProjectUseCaseRepository
    ){}
    public async execute (command:addTaskToProjectUseCaseCommand):Promise<void>{
        try {
            //loading the aggregate;
            const project=await this.projectRepository.findById(command.projectId);
            if(!project){
                throw new Error(`Project with id ${command.projectId} not found`);
            }
            //adding the task to the project;
            project.add(command.taskId);
            await this.projectRepository.save(project);
            //publishing the events;
            const events =project.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to add task to project with id ${command.projectId} because of ${error}`;
            throw new Error(errorMessage);
        }
    }
}