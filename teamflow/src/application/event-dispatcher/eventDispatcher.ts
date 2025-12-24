const eventBus = require('../../domains/observability/domainEvent/eventBus');
import type { DomainEvent } from '../../domains/observability/domainEvent/domainEvent.types';


type EventDispatcherAggregate={
    pullEvents(): DomainEvent[];
}

class EventDispatcher{
    constructor(
        private aggregate: EventDispatcherAggregate
    ){ }
    public static from(aggregate: EventDispatcherAggregate): void{
        //why pullevents() will work
        /**
         * Dont forget all the aggregate roots are extending the EventAggregateRoot class.
         * and eventAggregateRoot class has the pullEvents() method.
         */
        const events = aggregate.pullEvents();
        for (const event of events) {
            eventBus.publish(event);
        }
    }
}


module.exports = EventDispatcher;