const AssignmentDomain = require('../../../domains/operational/assignment/assignment');
const eventBus=require('../../../domains/observability/domainEvent/eventBus');


type unassignAssignmentUseCaseCommand={
    taskId: string;
}

interface unassignAssignmentUseCaseRepository{
    findByTaskId(id:string):Promise<InstanceType<typeof AssignmentDomain> | null>;
    save(assignment:InstanceType<typeof AssignmentDomain>):Promise<void>;
}

class UnassignAssignmentUseCase{
    constructor(
        private unassignAssignmentUseCaseRepository:unassignAssignmentUseCaseRepository
    ){}
    public async execute(command:unassignAssignmentUseCaseCommand):Promise<void>{
        try {
            //loading the entity;
            const assignment=await this.unassignAssignmentUseCaseRepository.findByTaskId(command.taskId);
            if(!assignment){
                throw new Error(`Assignment for task with id ${command.taskId} not found`);
            }
            //unassigning the task;
            assignment.unassign();
            await this.unassignAssignmentUseCaseRepository.save(assignment);
            //publishing the events;
            const events=assignment.pullEvents();
            for(const event of events){
                eventBus.publish(event);
            }
        }
        catch (error) {
            const errorMessage =`Failed to unassign task with id ${command.taskId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}
module.exports = UnassignAssignmentUseCase;