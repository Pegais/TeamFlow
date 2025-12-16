/**
 * Creating Event Bus to manage domain events.
 * it like system level event notification , where domains can subscribe to events and react to them.
 */

import type { DomainEvent } from "./domainEvent.types";


//creating a Eventhandler function type:
type EventHandler = (event: DomainEvent) => void;
class EventBus {
    //mapping eventype with its handler functions.
    private handlers:{[eventType:string]:EventHandler[]} = {};// Record<eventType:string, EventHandler[]>

    //subscribing of events based on event types :
    public subscribe(eventType:string,handler:EventHandler):void{
        if(!this.handlers[eventType]){
            this.handlers[eventType] = [];
        }
        this.handlers[eventType].push(handler);
    }

    //publishing of events :
    public publish(event:DomainEvent):void{
        const eventHandlers = this.handlers[event.type];
        if(!eventHandlers){
            return;
        }
        for(const handler of eventHandlers){
            handler(event);
        }
    }
    

}

//singleton instance :
const eventBus = new EventBus();
module.exports = eventBus;

