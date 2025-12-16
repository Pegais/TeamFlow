/**
 * Notificaton is obervability domain.
 * it is a domain event that is used to notify users of changes in the system.
 * UI friendly way to inform users of changes.
 */

import type { NotificationProps ,NotificationStatus} from "./notification.types";
const {v4: uuidv4} = require('uuid');
class NotificationDomain {
    private props: NotificationProps;
    constructor(props: NotificationProps) {
        this.props = props;
    }
    //static factory :
    public static create(
        recipientId:string,
        type:string,
        message:string,
    ): NotificationDomain {
        return new NotificationDomain({
            id: uuidv4(),
            recipientId,
            type,
            message,
            createdAt: new Date(),
            readAt: null,
        });
    }

    //behaviors :
    public markAsRead():void{
        if(this.props.readAt)return;
        this.props.readAt = new Date();
    }

    //queries :
    public get data():NotificationProps{
        return this.props;
    }

}

module.exports = NotificationDomain;