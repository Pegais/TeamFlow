import ProjectDomain from '../../../domains/operational/project/project';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';

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
            EventDispatcher.from(project);
        } catch (error) {
            const errorMessage =`Failed to remove task from project with id ${command.projectId} because of ${error}`;
            throw new Error(errorMessage);
        }
    }
}
export default RemoveTaskFromProjectUseCase;