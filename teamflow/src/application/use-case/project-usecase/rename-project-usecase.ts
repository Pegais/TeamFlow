const ProjectDomain = require('../../../domains/operational/project/project');
const EventDispatcher = require('../../event-dispatcher/eventDispatcher');
type renameProjectUseCaseCommand = {
    projectExistingName: string;
    newName: string;
}


interface renameProjectUseCaseRepository {
    findByName(name: string): Promise<InstanceType<typeof ProjectDomain> | null>;
    save(project: InstanceType<typeof ProjectDomain>): Promise<void>;
}

class RenameProjectUseCase {
    constructor(
        private projectRepository: renameProjectUseCaseRepository
    ) { }

    public async execute(command: renameProjectUseCaseCommand): Promise<void> {
        try {
            const project = await this.projectRepository.findByName(command.projectExistingName);
            if (!project) {
                throw new Error(`Project with name ${command.projectExistingName} not found`);
            }
            project.rename(command.newName);
            await this.projectRepository.save(project);

            //now we need to publish the event
           EventDispatcher.from(project);
        } catch (error) {
            const errorMessage = `Failed to rename project: ${error as Error}`;
            throw new Error(errorMessage);
        }
    }
}



module.exports = RenameProjectUseCase;