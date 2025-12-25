import ProjectDomain from '../../../domains/operational/project/project';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';

// project archive use case;

type archiveProjectUseCaseCommand={
    projectId:string;
}

interface archiveProjectUseCaseRepository{
    findById(id:string):Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project:InstanceType<typeof ProjectDomain>):Promise<void>;
}

class ArchiveProjectUseCase{
    constructor(
        private projectRepository:archiveProjectUseCaseRepository
    ){}
    public async execute(command:archiveProjectUseCaseCommand):Promise<void>{
        try {
            //load the aggregate;
            const project=await this.projectRepository.findById(command.projectId);
            if(!project){
                throw new Error(`Project with id ${command.projectId} not found`);
            }
            project.archive();

            await this.projectRepository.save(project);
            await EventDispatcher.from(project);
          
        } catch (error) {
            const errorMessage=`Failed to archive project: ${error as Error}`;
            throw new Error(errorMessage);
        }
    }
}

export default ArchiveProjectUseCase;