const ProjectDomain = require('../../../domains/operational/project/project');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');

type restoreProjectUseCaseCommand={
    projectId:string;
}

type restoreProjectUseCaseRepository={
    findById(id:string):Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project:InstanceType<typeof ProjectDomain>):Promise<void>;
}


class RestoreProjectUseCase{
    constructor(
        private projectRepository:restoreProjectUseCaseRepository
    ){}
    public async execute(command:restoreProjectUseCaseCommand):Promise<void>{
        try {
            //loading the aggregate;
            const project=await this.projectRepository.findById(command.projectId);
            if(!project){
                throw new Error(`Project with id ${command.projectId} not found`);
            }
            project.restore();
            await this.projectRepository.save(project);

            //publishing the events;
            const events= project.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        } catch (error) {
            const errorMessage=`Failed to restore project: ${error as Error}`;
            throw new Error(errorMessage);
        }
    }
}

module.exports = RestoreProjectUseCase;