# TeamFlow - Domain-Driven Design Project

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Domain Model](#domain-model)
4. [Event System](#event-system)
5. [Domain Details](#domain-details)
6. [Communication Patterns](#communication-patterns)
7. [Diagrams](#diagrams)

---

## Overview

TeamFlow is a domain-driven design (DDD) application for managing teams, workspaces, projects, and tasks. The system is built with a focus on domain modeling, event-driven architecture, and clear separation of concerns.

### Key Features
- **Workspace Management**: Create and manage workspaces with role-based access
- **Project Management**: Organize work into projects with lifecycle management
- **Task Management**: Track tasks through their lifecycle (todo → in_progress → completed)
- **User Management**: Handle user identities and lifecycle
- **Event-Driven Communication**: Decoupled domain communication through events

---

## Architecture

### Domain Structure

The project follows Domain-Driven Design principles with clear domain boundaries:

```
src/
├── domains/
│   ├── coretruthDomain/     # Core business entities
│   │   └── user/
│   │       └── workspaceDomains/
│   │           └── workspace/
│   ├── global/              # Global entities
│   │   └── user/
│   ├── operational/         # Operational domains
│   │   ├── project/
│   │   ├── task/
│   │   ├── assignment/
│   │   ├── comment/
│   │   └── activity/
│   ├── behavioural/        # Behavioral domains
│   │   ├── membership/
│   │   └── policyAndPermissions/
│   ├── lifecycle/          # Lifecycle management
│   │   └── invitation/
│   ├── observability/      # Cross-cutting concerns
│   │   ├── domainEvent/
│   │   ├── audit/
│   │   └── notification/
│   └── supportDomain/      # Supporting domains
│       └── audit/
└── application/
    ├── use-case/           # Application use cases
    ├── event-dispatcher/   # Event publishing
    └── event-Subscribers/  # Event handlers
```

### Layered Architecture

1. **Domain Layer**: Pure business logic, no dependencies on infrastructure
2. **Application Layer**: Use cases orchestrate domain operations
3. **Infrastructure Layer**: External concerns (persistence, messaging)

---

## Domain Model

### Domain Categories

#### 1. Core Truth Domains
Domains that represent fundamental business concepts:
- **Workspace**: Container for teams, projects, and tasks

#### 2. Global Domains
Domains that exist independently across the system:
- **User**: User identity and lifecycle

#### 3. Operational Domains
Domains that handle day-to-day operations:
- **Project**: Project management and lifecycle
- **Task**: Task lifecycle and status management
- **Assignment**: Task assignment to users
- **Comment**: Comments on tasks/projects
- **Activity**: Activity tracking

#### 4. Behavioral Domains
Domains that manage behavior and policies:
- **Membership**: Membership management
- **Permissions**: Access control and permissions

#### 5. Lifecycle Domains
Domains that manage entity lifecycles:
- **Invitation**: Invitation lifecycle

#### 6. Observability Domains
Cross-cutting concerns:
- **Domain Events**: Event system
- **Audit**: Audit logging
- **Notification**: Notification system

---

## Event System

### EventAggregateRoot Abstract Class

All domain aggregates extend `EventAggregateRoot` to enable event-driven communication.

**Location**: `domains/observability/domainEvent/eventAggregateRoot.ts`

```typescript
abstract class EventAggregateRoot {
    private domainEvents: DomainEvent[] = [];
    
    // Protected method for child classes to add events
    protected addEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }
    
    // Public method to retrieve and clear events
    public pullEvents(): DomainEvent[] {
        const events = [...this.domainEvents];
        this.domainEvents = [];
        return events;
    }
}
```

**Purpose**:
- Provides a mechanism for aggregates to collect domain events
- Events are stored temporarily until published
- `pullEvents()` retrieves and clears events (prevents duplicate publishing)

**Usage**:
```typescript
class ProjectDomain extends EventAggregateRoot {
    public add(taskId: string): void {
        // ... business logic ...
        this.addEvent({
            type: "TASK_ADDED_TO_PROJECT",
            occuredAt: new Date(),
            metadata: { projectId: this.props.id, taskId }
        });
    }
}
```

### EventBus

**Location**: `domains/observability/domainEvent/eventBus.ts`

The EventBus is a singleton that manages event subscriptions and publishing.

```typescript
class EventBus {
    private handlers: {[eventType: string]: EventHandler[]} = {};
    
    // Subscribe to an event type
    public subscribe(eventType: string, handler: EventHandler): void
    
    // Publish an event to all subscribers
    public async publish(event: DomainEvent): Promise<void>
}
```

**Features**:
- **Singleton Pattern**: Single instance across the application
- **Type-based Subscription**: Subscribe to specific event types
- **Multiple Handlers**: Multiple handlers can subscribe to the same event type
- **Async Support**: Handlers are async and executed sequentially

**Event Subscription**:
```typescript
eventBus.subscribe("TASK_ADDED_TO_PROJECT", async (event) => {
    // Handle the event
    await processTaskAdded(event);
});
```

**Event Publishing**:
```typescript
await eventBus.publish({
    type: "TASK_ADDED_TO_PROJECT",
    occuredAt: new Date(),
    metadata: { projectId: "123", taskId: "task-1" }
});
```

### EventDispatcher

**Location**: `application/event-dispatcher/eventDispatcher.ts`

The EventDispatcher is responsible for publishing events from aggregates to the EventBus.

```typescript
class EventDispatcher {
    public static async from(aggregate: EventDispatcherAggregate): Promise<void> {
        const events = aggregate.pullEvents();
        for (const event of events) {
            await eventBus.publish(event);
        }
    }
}
```

**Purpose**:
- Extracts events from aggregates using `pullEvents()`
- Publishes each event to the EventBus
- Handles errors during event publishing

**Usage in Use Cases**:
```typescript
// After domain operation
project.add("task-1");
await repository.save(project);

// Publish events
await EventDispatcher.from(project);
```

### Domain Event Types

**Location**: `domains/observability/domainEvent/domainEvent.types.ts`

```typescript
export type DomainEvent = {
    readonly type: string;
    readonly occuredAt: Date;
    readonly metadata?: Record<string, any>;
}
```

**Event Types by Domain**:

| Domain     | Event Types                          |
|------------|--------------------------------------|
| Task       | TASK_CREATED, TASK_STARTED, TASK_COMPLETED |
| Project    | PROJECT_CREATED, PROJECT_RENAMED, PROJECT_ARCHIVED, PROJECT_RESTORED, PROJECT_DELETED, TASK_ADDED_TO_PROJECT, TASK_REMOVED_FROM_PROJECT |
| Workspace  | WORKSPACE_MEMBER_ADDED, WORKSPACE_MEMBER_REMOVED, WORKSPACE_DELETED |
| User       | USER_CREATED, USER_SUSPENDED, USER_ACTIVATED, USER_DELETED |

---

## Domain Details

### 1. Project Domain

**Location**: `domains/operational/project/project.ts`

**Purpose**: Manages projects within a workspace. Projects are aggregate roots that enforce business rules around task management and project lifecycle.

#### Invariants
1. A project has a name (required, non-empty)
2. A project must belong to at least one workspace
3. A project can be in one of three states: `active`, `archived`, or `deleted`
4. A project can only be deleted if no active tasks exist
5. An archived project cannot accept new tasks
6. A deleted project will not allow any operations on it

#### Lifecycle

**Status Transitions**:
```
active → archived
active → deleted (only if no active tasks)
archived → active
archived → deleted (only if no active tasks)
deleted → (terminal state, no transitions allowed)
```

**State Diagram**:
```
[active] ──archive()──> [archived]
   │                        │
   │                        │
   └──delete(noTasks)──> [deleted] <──delete(noTasks)── [archived]
```

#### Operations
- `create(name, workspaceId)`: Static factory method to create a project
- `rename(name)`: Rename the project (cannot be deleted)
- `archive()`: Archive the project (cannot be deleted)
- `restore()`: Restore archived project to active
- `delete(hasActiveTasks)`: Delete project (only if no active tasks)
- `add(taskId)`: Add a task to the project (cannot be deleted/archived)
- `remove(taskId)`: Remove a task from the project (cannot be deleted)

#### Invariant Enforcement

**Guards**:
- `ensureNameNotEmpty()`: Validates project name is not empty
- `ensureNotDeleted()`: Ensures project is not in deleted state
- `ensureCanBeDeleted(hasActiveTasks)`: Validates no active tasks exist
- `ensureProjectBelongsToWorkspace()`: Validates workspace association
- `ensureValidTransition(from, to)`: Validates state transitions
- `ensureArchievedProjectCannotAcceptNewTasks()`: Prevents adding tasks to archived projects

#### Events Emitted
- `PROJECT_CREATED`
- `PROJECT_RENAMED`
- `PROJECT_ARCHIVED`
- `PROJECT_RESTORED`
- `PROJECT_DELETED`
- `TASK_ADDED_TO_PROJECT`
- `TASK_REMOVED_FROM_PROJECT`

---

### 2. Task Domain

**Location**: `domains/operational/task/task.ts`

**Purpose**: Manages individual tasks and their lifecycle. Tasks track work items through their completion lifecycle.

#### Invariants
1. A task must have a title (required, non-empty)
2. A task can be in one of four states: `todo`, `in_progress`, `completed`, or `deleted`
3. A deleted task cannot be modified
4. Tasks follow a strict state flow: `todo → in_progress → completed → deleted`

#### Lifecycle

**Status Transitions**:
```
todo → in_progress
todo → deleted
in_progress → completed
in_progress → deleted
completed → (terminal, no transitions)
deleted → (terminal, no transitions)
```

**State Diagram**:
```
[todo] ──start()──> [in_progress] ──complete()──> [completed]
  │                      │
  │                      │
  └──delete()──> [deleted] <──delete()── [in_progress]
```

#### Operations
- `create()`: Initialize a task (sets status to `todo`, timestamps)
- `start()`: Move task from `todo` to `in_progress`
- `complete()`: Move task from `in_progress` to `completed`
- `delete()`: Mark task as deleted (can be called from `todo` or `in_progress`)

#### Invariant Enforcement

**Guards**:
- `ensureTitleNotEmpty()`: Validates task title is not empty
- `ensureNotDeleted()`: Ensures task is not in deleted state
- `ensureValidTransition(from, to)`: Validates state transitions follow allowed flow

#### Events Emitted
- `TASK_CREATED`
- `TASK_STARTED`
- `TASK_COMPLETED`

---

### 3. Workspace Domain

**Location**: `domains/coretruthDomain/user/workspaceDomains/workspace/workspace.ts`

**Purpose**: Manages workspaces, which are containers for teams, projects, and tasks. Workspaces enforce team membership rules and capacity limits.

#### Invariants
1. A workspace has a name and description
2. A workspace must have at least one owner
3. A workspace has a maximum capacity of 20 members
4. A workspace can be in states: `active`, `inactive`, or `deleted`
5. Only owners can perform destructive actions (delete, remove members)
6. The last owner cannot be removed from a workspace
7. A workspace cannot be deleted if it has active tasks

#### Lifecycle

**Status**:
- `active`: Workspace is operational with at least one owner
- `inactive`: No owner or team head present
- `deleted`: Workspace has been deleted

#### Operations
- `create(ownerId, name, description)`: Static factory to create workspace with owner
- `addMember(creatorId, userId, role)`: Add member (only by owner/teamHead)
- `removeMember(creatorId, userId)`: Remove member (only by owner, cannot remove last owner)
- `deleteWorkspace(creatorId, hasActiveTasks)`: Delete workspace (only by owner, no active tasks)

#### Invariant Enforcement

**Guards**:
- `hasatleastOneOwner()`: Checks if workspace has at least one owner
- `ensureNotDeleted()`: Ensures workspace is not deleted
- `ensureOwnerExists()`: Validates owner exists before operations
- `ensureNotRemovingLastOwner(userId)`: Prevents removing the last owner
- `ensureMemberExists(userId)`: Validates member exists for removal
- `ensureCallerIsOwner(callerId)`: Validates caller is owner for destructive actions
- `ensureCapacityAvailable()`: Validates workspace capacity (max 20)
- `ensureMemberDoesNotExist(userId)`: Validates member doesn't exist before adding
- `ensureNoActiveTasks(hasActiveTasks)`: Validates no active tasks before deletion

#### Events Emitted
- `WORKSPACE_MEMBER_ADDED`
- `WORKSPACE_MEMBER_REMOVED`
- `WORKSPACE_DELETED`

---

### 4. User Domain

**Location**: `domains/global/user/user.ts`

**Purpose**: Manages user identity and lifecycle. Users exist independently and can belong to multiple workspaces.

#### Invariants
1. A user has an id, email, and name
2. Email is unique and immutable (cannot be changed after creation)
3. A user can be in states: `active`, `suspended`, or `deleted`
4. A deleted user cannot perform any action and cannot be reactivated
5. A suspended user cannot perform actions but can be reactivated

#### Lifecycle

**Status Transitions**:
```
active → suspended
active → deleted
suspended → active (reactivation)
deleted → (terminal, no transitions)
```

**State Diagram**:
```
[active] ──suspend()──> [suspended] ──activate()──> [active]
   │
   │
   └──delete()──> [deleted] (terminal)
```

#### Operations
- `createUser(email, name)`: Static factory to create a user
- `suspendUser()`: Suspend an active user
- `activateUser(email)`: Reactivate a suspended user
- `deleteUser(email)`: Delete a user (permanent, cannot be reactivated)

#### Invariant Enforcement

**Guards**:
- `ensureEmailAndNameAreProvided()`: Validates email and name are provided
- `ensureNotDeleted()`: Ensures user is not deleted
- `ensureActive()`: Ensures user is active for certain operations
- `ensureUserIsSuspended()`: Ensures user is suspended for reactivation

#### Events Emitted
- `USER_CREATED`
- `USER_SUSPENDED`
- `USER_ACTIVATED`
- `USER_DELETED`

---

## Communication Patterns

### Event-Driven Communication

The system uses domain events for decoupled communication between domains:

1. **Domain Operation**: Aggregate performs business operation
2. **Event Generation**: Aggregate adds event to internal collection
3. **Event Extraction**: Use case calls `EventDispatcher.from(aggregate)`
4. **Event Publishing**: EventDispatcher pulls events and publishes to EventBus
5. **Event Subscription**: Subscribed handlers process events

**Flow Diagram**:
```
[Domain Aggregate] 
    │
    ├─> addEvent() ──> [Event Collection]
    │
[Use Case]
    │
    ├─> EventDispatcher.from(aggregate)
    │
[EventDispatcher]
    │
    ├─> pullEvents() ──> [EventBus]
    │
[EventBus]
    │
    ├─> publish(event) ──> [Subscribers]
    │
[Event Handlers]
```

### Use Case Pattern

All use cases follow a consistent pattern:

```typescript
class UseCase {
    constructor(private repository: Repository) {}
    
    public async execute(command: Command): Promise<void> {
        // 1. Load aggregate
        const aggregate = await this.repository.findById(command.id);
        
        // 2. Perform domain operation
        aggregate.operation();
        
        // 3. Persist changes
        await this.repository.save(aggregate);
        
        // 4. Publish events
        await EventDispatcher.from(aggregate);
    }
}
```

---

## Diagrams

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Use Cases   │  │EventDispatcher│  │ Subscribers  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼───────────────┐
│         │                 │                 │  Domain Layer │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐         │
│  │  Project    │  │    Task     │  │  Workspace │         │
│  │  Domain     │  │   Domain    │  │   Domain    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                │
│  ┌──────▼─────────────────▼─────────────────▼──────┐       │
│  │         EventAggregateRoot (Abstract)            │       │
│  │  - addEvent()                                    │       │
│  │  - pullEvents()                                  │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼─────────────────────────────────────────────────────┐
│                    Observability Layer                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                  EventBus (Singleton)                 │    │
│  │  - subscribe(eventType, handler)                     │    │
│  │  - publish(event)                                    │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Event Flow Sequence

```
User Action
    │
    ▼
[Use Case]
    │
    ├─> Load Aggregate from Repository
    │
    ├─> Aggregate.operation()
    │       │
    │       └─> addEvent({ type, metadata })
    │
    ├─> Repository.save(aggregate)
    │
    └─> EventDispatcher.from(aggregate)
            │
            ├─> aggregate.pullEvents()
            │       └─> Returns events, clears collection
            │
            └─> For each event:
                    │
                    └─> eventBus.publish(event)
                            │
                            └─> Notify all subscribers
                                    │
                                    └─> Handler.process(event)
```

### Domain Relationships

```
┌─────────────┐
│  Workspace  │
│  (Core)     │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│   Project   │  │    User     │
│ (Operational)│  │  (Global)   │
└──────┬──────┘  └──────────────┘
       │
       ▼
┌─────────────┐
│    Task     │
│(Operational)│
└─────────────┘
```

### Project Lifecycle State Machine

```
        ┌─────────┐
        │  active │
        └────┬────┘
             │
    ┌────────┼────────┐
    │        │        │
archive()   │    delete(noTasks)
    │        │        │
    ▼        │        ▼
┌─────────┐  │   ┌─────────┐
│archived │  │   │ deleted │
└────┬────┘  │   └─────────┘
     │       │      (terminal)
restore()    │
     │       │
     └───────┘
```

### Task Lifecycle State Machine

```
     ┌──────┐
     │ todo │
     └──┬───┘
        │
   ┌────┼────┐
   │    │    │
start() │ delete()
   │    │    │
   ▼    │    ▼
┌──────────┐ │ ┌────────┐
│in_progress│ │ │deleted │
└─────┬────┘ │ └────────┘
      │     │   (terminal)
complete()  │
      │     │
      ▼     │
┌──────────┐│
│completed ││
└──────────┘│
(terminal)  │
            │
            └─── (terminal)
```

---

## Best Practices

### Domain Modeling
- **Aggregate Roots**: Each domain has one aggregate root that enforces invariants
- **Guards**: All business rules are enforced through guard methods
- **Immutable Events**: Domain events are immutable and represent facts
- **Single Responsibility**: Each domain has a clear, single responsibility

### Event Handling
- **Event Naming**: Events use past tense (e.g., `TASK_ADDED`, `PROJECT_CREATED`)
- **Event Metadata**: Include relevant context in event metadata
- **Idempotency**: Event handlers should be idempotent when possible
- **Error Handling**: Event publishing errors should not break the main flow

### Use Case Design
- **Command Pattern**: Use cases accept command objects
- **Repository Pattern**: Abstract persistence behind repositories
- **Transaction Boundaries**: Use cases define transaction boundaries
- **Error Propagation**: Domain errors bubble up through use cases

---

## Getting Started

### Prerequisites
- Node.js
- TypeScript
- Jest (for testing)

### Installation
```bash
npm install
```

### Running Tests
```bash
npm test
```

---

## License

ISC

