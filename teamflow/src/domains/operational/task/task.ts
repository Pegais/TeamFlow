import EventAggregateRoot from "../../observability/domainEvent/eventAggregateRoot";
import type { TaskProps, TaskStatus } from "./task.types";

class TaskDomain extends EventAggregateRoot {
    private props: TaskProps


    //working on the domain invariants and guards:
    //1.task must have a title.
    private ensureTitleNotEmpty(): void {
        if (!this.props.title || this.props.title.trim() === "") {
            throw new Error("Task title is required");
        }
    }

    //2.ensure task is not deleted.
    private ensureNotDeleted(): void {
        if (this.props.status === "deleted") {
            throw new Error("Task is deleted and cannot be modified");
        }
    }

    //ensure task follows the status flow:
    //that is todo -> in_progress -> completed -> deleted.
    //trasition allowed are thus follows:
    //todo -> in_progress
    //in_progress -> completed
    //if deleted, no transition is allowed.
    //if completed, cannnot become in_progress or todo.
    //inprogress cannot become todo or completed.
    private ensureValidTransition(from: TaskStatus, to: TaskStatus): void {

        let allowedNextStates: TaskStatus[] = [];

        if (from === "todo") {
            allowedNextStates = ["in_progress", "deleted"];
        }

        if (from === "in_progress") {
            allowedNextStates = ["completed", "deleted"];
        }

        if (from === "completed" || from === "deleted") {
            allowedNextStates = [];
        }

        if (!allowedNextStates.includes(to)) {
            throw new Error(`Invalid task transition: ${from} → ${to}`);
        }


    }


    constructor(props: TaskProps) {
        super();
        this.props = props;
    }

    //defining the methods :
    public create():void{
        this.ensureTitleNotEmpty();
       
        //this is creation, it only sets intial valid state.
        this.props.status="todo";
        this.props.createdAt=new Date();
        this.props.updatedAt=new Date();
        this.addEvent({
            type: "TASK_CREATED",
            occuredAt: new Date(),
        });
    }

    //start() : this methods starts the task from todo to in_progress.
    public start():void{
        //nesure task title isnot empty;
        this.ensureTitleNotEmpty();
        //ensure task is not deleted;
        this.ensureNotDeleted();
        //ensure task is in todo state;
        this.ensureValidTransition(this.props.status, "in_progress");
        //update the status;
        this.props.status="in_progress";
        this.props.updatedAt=new Date();
        this.addEvent({
            type: "TASK_STARTED",
            occuredAt: new Date(),
        });
    }

    //complete() : this methods completes the task from in_progress to completed.
    public complete():void{
        //nesure task title isnot empty;
        this.ensureTitleNotEmpty();
        //ensure task is not deleted;
        this.ensureNotDeleted();
        //ensure task is in in_progress state;
        this.ensureValidTransition(this.props.status, "completed");
        //update the status;
        this.props.status="completed";
        this.props.updatedAt=new Date();
        this.addEvent({
            type: "TASK_COMPLETED",
            occuredAt: new Date(),
        });
    }
}
export default TaskDomain;

