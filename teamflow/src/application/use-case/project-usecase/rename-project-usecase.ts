import ProjectDomain from '../../../domains/operational/project/project';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';
type renameProjectUseCaseCommand = {
    projectId: string;
    newName: string;
}


interface renameProjectUseCaseRepository {
    findById(name: string): Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project: InstanceType<typeof ProjectDomain>): Promise<void>;
}

class RenameProjectUseCase {
    constructor(
        private projectRepository: renameProjectUseCaseRepository
    ) { }

    public async execute(command: renameProjectUseCaseCommand): Promise<void> {
        try {
            const project = await this.projectRepository.findById(command.projectId);
            if (!project) {
                throw new Error(`Project with name ${command.projectId} not found`);
            }
            project.rename(command.newName);
            await this.projectRepository.save(project);

            //now we need to publish the event
           await EventDispatcher.from(project);
        } catch (error) {
            const errorMessage = `Failed to rename project: ${error as Error}`;
            throw new Error(errorMessage);
        }
    }
}



export default RenameProjectUseCase;