// create project usecase

import ProjectDomain from '../../../domains/operational/project/project';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';

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
        try {
            const project=ProjectDomain.create(command.name,command.workspaceId);
        await this.projectRepository.save(project);

        //now we need to publish the event
        await EventDispatcher.from(project);
        } catch (error) {
            const errorMessage=`Failed to create project: ${error as Error}`;
            throw new Error(errorMessage);
            
        }
    }
}

export default CreateProjectUseCase;