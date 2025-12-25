import AssignmentDomain from '../../../domains/operational/assignment/assignment';
import EventDispatcher from '../../event-dispatcher/eventDispatcher';


type assignAssignmentUseCaseCommand = {
    taskId: string, //id of the task we need to assign;
    userId: string, //id of the user we need to assign the task to;
    taskStatus: 'todo' | 'in_progress',//status of task ;only this task status is allowed to be assigned;
    isMemberofworkspace: boolean,//if the user is a member of the workspace;
    isProjectArchived: boolean//if the project is archived;
}
interface assignAssignmentUseCaseRepository{
    findByTaskId(id:string):Promise<InstanceType<typeof AssignmentDomain> | null>;
    save(assignment:InstanceType<typeof AssignmentDomain>):Promise<void>;
}
class AssignAssignmentUseCase{
    constructor(
        private assignAssignmentUseCaseRepository:assignAssignmentUseCaseRepository
    ){}

    public async execute(command:assignAssignmentUseCaseCommand):Promise<void>{
        try {
            //loadint the task entity for which we need to assign the task;
            const assignment=await this.assignAssignmentUseCaseRepository.findByTaskId(command.taskId);
            if(!assignment){
                throw new Error(`Assignment for task with id ${command.taskId} not found`);
            }
            //assigning the task to the user;
            assignment.assign(command.userId, command.taskStatus, command.isMemberofworkspace, command.isProjectArchived);
            await this.assignAssignmentUseCaseRepository.save(assignment);
            //publishing the events;
           EventDispatcher.from(assignment);
        } catch (error) {
            const errorMessage =`Failed to assign task with id ${command.taskId} to user with id ${command.userId} because of ${error}`;
            throw new Error(errorMessage,{cause:error});
        }
    }
}
export default AssignAssignmentUseCase;
