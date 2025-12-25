import eventBus from '../../domains/observability/domainEvent/eventBus';
import type { DomainEvent } from '../../domains/observability/domainEvent/domainEvent.types';


type EventDispatcherAggregate={
    pullEvents(): DomainEvent[];
}

class EventDispatcher{
    constructor(
        private aggregate: EventDispatcherAggregate
    ){ }
     public static async from(aggregate: EventDispatcherAggregate): Promise<void>{
        //why pullevents() will work
        /**
         * Dont forget all the aggregate roots are extending the EventAggregateRoot class.
         * and eventAggregateRoot class has the pullEvents() method.
         */
      try {
        const events =  aggregate.pullEvents();
        for (const event of events) {
            eventBus.publish(event);
        }
      } catch (error) {
        const errorMessage = `Error in publishing events: ${error}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    }
}


export default EventDispatcher;