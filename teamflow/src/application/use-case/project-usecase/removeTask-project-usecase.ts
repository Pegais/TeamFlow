const ProjectDomain = require('../../../domains/operational/project/project');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');


type removeTaskFromProjectUseCaseCommand={
    projectId:string;//id of the project;
    taskId:string;//id of the task;
}

interface removeTaskFromProjectUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project:InstanceType<typeof ProjectDomain>):Promise<void>;
}

class RemoveTaskFromProjectUseCase{
    private props:removeTaskFromProjectUseCaseRepository;
    constructor(props:removeTaskFromProjectUseCaseRepository){
        this.props=props;
    }


    public async execute(command:removeTaskFromProjectUseCaseCommand):Promise<void>{
        try {
            //loading the aggregate;
            const project=await this.props.findById(command.projectId);
            if(!project){
                throw new Error(`Project with id ${command.projectId} not found`);
            }
            //removing the task from the project;
            project.remove(command.taskId);
            await this.props.save(project);
            //publishing the events;
            const events =project.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage =`Failed to remove task from project with id ${command.projectId} because of ${error}`;
            throw new Error(errorMessage);
        }
    }
}