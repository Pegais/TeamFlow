// create project usecase

const ProjectDomain = require('../../domains/operational/project/project');
const eventBus=require('../../domains/observability/domainEvent/eventBus');


type createProjectUseCaseCommand={
    name:string;//project name
    workspaceId:string;//workspace id with which the project is associated
}

interface createProjectUseCaseRepository{
    save(project:InstanceType<typeof ProjectDomain>):Promise<void>;
}


class CreateProjectUseCase{
    constructor(
        private projectRepository:createProjectUseCaseRepository
    ){}


    public async execute(command:createProjectUseCaseCommand):Promise<void>{
        //lets create the project
        const project=ProjectDomain.create(command.name,command.workspaceId);
        await this.projectRepository.save(project);

        //now we need to publish the event
        const events= project.pullEvents();
        for(const event of events){
            eventBus.publish(event);
        }
    }
}

module.exports=CreateProjectUseCase;