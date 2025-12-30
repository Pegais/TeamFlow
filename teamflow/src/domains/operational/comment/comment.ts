/**
 * Defining the comment domain invarients(source of truth);
 * 
 * A comment is valid only if :
 * it is not empty comment.
 * It has an author .
 * It must belong to either a task or a project not both .
 * It can not be mutated once deleted.
 * Its lifecycle is created->updated->deleted.
 * Comment is immutable in terms of authorship.
 * 
 * 
 */

import type { CommentProps } from "./comment.type";
import EventAggregateRoot from "../../../domains/observability/domainEvent/eventAggregateRoot";
class CommentDomain extends EventAggregateRoot {
    private props: CommentProps;


    //  //guards for comment domain to protect its invariants.
    //1. ensure the comment is not empty.
    private ensureContentNotEmpty(): void {
        if (!this.props.content || this.props.content.trim() === '') {
            throw new Error('Comment content can never be empty');
        }
    }

    //ensure the comment is not deleted.
    private ensureNotDeleted(): void {
        if (this.props.deletedAt) {
            throw new Error('Comment is deleted and cannot be mutated');
        }
    }

    //ensure the comment is either related to a task or a project but not both.
    private ensureValidContext(): void {
        let hastaskContext = !!this.props.taskId;
        let hasprojectContext = !!this.props.projectId;
        if (hastaskContext === hasprojectContext) {
            throw new Error('Comment must be related to either a task or a project but not both');
        }
    }
    constructor(props: CommentProps) {
        super();
        this.props = props;
        this.ensureValidContext();
        this.ensureContentNotEmpty();
    }

    //static factory :
    public static create(props: CommentProps): CommentDomain {
        const comment = new CommentDomain({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        comment.addEvent({
            type: "COMMENT_CREATED",
            occuredAt: new Date(),
          metadata: {
            commentId: comment.props.id,
            taskId: comment.props.taskId,
            projectId: comment.props.projectId,
          }
        });
        return comment;
    }

    //public methods :
    public edit(newContent: string): void {
        this.ensureNotDeleted();
        if (!newContent || newContent.trim() === '') {
            throw new Error('Comment content can never be empty');
        }
        this.props.content = newContent;
        this.props.updatedAt = new Date();
        this.addEvent({
            type: "COMMENT_UPDATED",
            occuredAt: new Date(),
           metadata: {
            commentId: this.props.id,
            taskId: this.props.taskId,
            projectId: this.props.projectId,
           }
        })
    }

    public delete(): void {
        this.ensureNotDeleted();
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
        this.addEvent({
            type: "COMMENT_DELETED",
            occuredAt: new Date(),
            metadata: {
                commentId: this.props.id,
                taskId: this.props.taskId,
                projectId: this.props.projectId,
            }
        })
    }

    //Queries :
    public get data(): CommentProps {
        return this.props;
    }

}

export default CommentDomain;