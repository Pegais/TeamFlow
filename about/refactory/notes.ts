/**
 * EVENT DISPATCHER NOTES :
 */

//First major refactory : 
    //pull emmitted domain events
    //    const events = workspace.pullEvents();
    //    //publish the events via event bus
    //    for (const event of events) {
    //        eventBus.publish(event);
    //    }


/**
 * This line of code is used to pull the emitted domain events from every domain that is enitity or aggregate roots like workspace and project.
 * The above code for pulling events and publishing it is becoming repetitive 
 * so we need to create a base class for all the domains that will have the method to pull events and publish it.
 * To fix it, we will create a base class with the above boilerplate code and use it to disptach the pulling and publishing of events.
 * 
 * Thus this major refactory will help us design our eventDispatcher.
 */

// type EventDispatcherAggregate={
//     pullEvents(): DomainEvent[];
// }

// class EventDispatcher{
//     constructor(
//         private aggregate: EventDispatcherAggregate
//     ){ }
//     public static from(aggregate: EventDispatcherAggregate): void{
//         //why pullevents() will work
//         /**
//          * Dont forget all the aggregate roots are extending the EventAggregateRoot class.
//          * and eventAggregateRoot class has the pullEvents() method.
//          */
//         const events = aggregate.pullEvents();
//         for (const event of events) {
//             eventBus.publish(event);
//         }
//     }
// }
//**********************************************************************************************************/


// [ Domain Method ]
//       |
//       v
// addEvent(...)
//       |
//       v
// EventAggregateRoot stores events /also pullevents logic here
//       |
//       v
// Use Case finishes
//       |
//       v
// EventDispatcher.from(aggregate)
//       |
//       v
// aggregate.pullEvents()
//       |
//       v
// EventBus.publish(event)
//       |
//       v
// Subscribers react
