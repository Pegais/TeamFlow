import ProjectDomain from '../../../domains/operational/project/project';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';

type deleteProjectUseCaseCommand={
    projectId:string;
    hasActiveTasks:boolean;
}

interface deleteProjectUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project:InstanceType<typeof ProjectDomain>):Promise<void>;
}

class DeleteProjectUseCase{
    constructor(
        private projectRepository:deleteProjectUseCaseRepository
    ){}
    public async execute(command:deleteProjectUseCaseCommand):Promise<void>{
        try {
            //loading the aggregate;
            const project= await this.projectRepository.findById(command.projectId);
            if(!project){
                throw new Error(`Project with id ${command.projectId} not found`);
            }
            //deleting the project;
            project.delete(command.hasActiveTasks);
            await this.projectRepository.save(project);
           
            //publishing the events;
            await EventDispatcher.from(project);
        } catch (error) {
            const errorMessage =`Failed to delete project with id ${command.projectId} because of ${error}`;
            throw new Error(errorMessage);
        }

    }
}

export default DeleteProjectUseCase;