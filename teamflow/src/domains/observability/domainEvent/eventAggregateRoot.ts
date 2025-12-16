import type { DomainEvent } from "./domainEvent.types";

abstract class EventAggregateRoot {
    private domainEvents: DomainEvent[] = [];
    

    //creatin protected method:
    //protectted method can be accessed by the child classes.
    protected addEvent(event:DomainEvent):void{
        this.domainEvents.push(event);
    }

    public pullEvents():DomainEvent[]{
        const events=[...this.domainEvents];
        this.domainEvents = [];
        return events;
    }
}

module.exports = EventAggregateRoot;