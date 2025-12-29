# TeamFlow Test Documentation

## Overview

This document provides comprehensive documentation for all test files in the TeamFlow project. Tests are organized by domain and cover business rules, invariants, lifecycle management, and event emission.

---

## Table of Contents

1. [Project Domain Tests](#project-domain-tests)
2. [Workspace Domain Tests](#workspace-domain-tests)
3. [User Domain Tests](#user-domain-tests)

---

## Project Domain Tests

**Location**: `src/testing/jest-test/projectDomain/`

### 1. `create-project.test.ts`

**Purpose**: Tests project creation functionality and event emission.

#### Test Cases

**Test 1: Project must belong to a workspace**
- **Purpose**: Validates that a project cannot be created without a workspace ID
- **Setup**: Empty workspace ID
- **Action**: Attempt to create project with empty workspace ID
- **Assertion**: Throws error "Workspace ID is required"
- **Invariant Tested**: Project must belong to at least one workspace

**Test 2: Project creation emits PROJECT_CREATED event**
- **Purpose**: Validates that project creation emits the correct domain event
- **Setup**: Valid project name and workspace ID
- **Action**: Create project using use case
- **Assertion**: 
  - Event is captured and not null
  - Event type is "PROJECT_CREATED"
- **Event System Test**: Verifies event bus subscription and publishing

---

### 2. `addTask-project.test.ts`

**Purpose**: Tests adding tasks to projects, including state validation and event emission.

#### Test Cases

**Test 1: Cannot add task to deleted project**
- **Purpose**: Validates that tasks cannot be added to deleted projects
- **Setup**: Create project and delete it
- **Action**: Attempt to add task to deleted project
- **Assertion**: 
  - Project status is "deleted"
  - Throws error "Project is deleted"
- **Invariant Tested**: Deleted projects cannot accept operations

**Test 2: Archived project cannot accept new tasks**
- **Purpose**: Validates that archived projects cannot accept new tasks
- **Setup**: Create project and archive it
- **Action**: Attempt to add task to archived project
- **Assertion**: 
  - Project status is "archived"
  - Throws error "Archived project cannot accept new tasks"
- **Invariant Tested**: Archived projects cannot accept new tasks

**Test 3: Adding task emits TASK_ADDED_TO_PROJECT event**
- **Purpose**: Validates event emission when tasks are added
- **Setup**: 
  - Create project
  - Set up fake repository and subscriber
  - Subscribe to "TASK_ADDED_TO_PROJECT" event
- **Action**: 
  - Add multiple tasks using use case
- **Assertion**: 
  - Event is captured and not null
  - Event type is "TASK_ADDED_TO_PROJECT"
  - Project contains 3 tasks (verified via helper methods)
  - Task exists in project (verified via `hasTask()` helper)
- **Event System Test**: Verifies event bus integration
- **Helper Methods Test**: Tests repository helper methods (`getTaskIds()`, `hasTask()`)

---

### 3. `removeTask-project.test.ts`

**Purpose**: Tests removing tasks from projects and event emission.

#### Test Cases

**Test 1: Cannot remove task from deleted project**
- **Purpose**: Validates that tasks cannot be removed from deleted projects
- **Setup**: Create project and delete it
- **Action**: Attempt to remove task from deleted project
- **Assertion**: 
  - Project status is "deleted"
  - Throws error "Project is deleted"
- **Invariant Tested**: Deleted projects cannot accept operations

**Test 2: Removing task emits TASK_REMOVED_FROM_PROJECT event**
- **Purpose**: Validates event emission when tasks are removed
- **Setup**: 
  - Create project
  - Add multiple tasks first
  - Subscribe to both "TASK_ADDED_TO_PROJECT" and "TASK_REMOVED_FROM_PROJECT" events
- **Action**: 
  - Add tasks, then remove a task using use case
- **Assertion**: 
  - Event is captured
  - Event type is "TASK_REMOVED_FROM_PROJECT"
  - Project contains 2 tasks after removal (verified via helper)
- **Event System Test**: Verifies event bus integration for removal operations

---

### 4. `archive-project.test.ts`

**Purpose**: Tests project archiving functionality and state transitions.

#### Test Cases

**Test 1: Archive a project**
- **Purpose**: Validates successful project archiving
- **Setup**: Create active project
- **Action**: Archive the project
- **Assertion**: Project status is "archived"
- **Lifecycle Test**: Validates active → archived transition

**Test 2: Cannot archive deleted project**
- **Purpose**: Validates that deleted projects cannot be archived
- **Setup**: Create project and delete it
- **Action**: Attempt to archive deleted project
- **Assertion**: 
  - Project status is "deleted"
  - Throws error "Project is deleted"
- **Invariant Tested**: Deleted projects cannot be modified

**Test 3: Archiving emits PROJECT_ARCHIVED event**
- **Purpose**: Validates event emission when project is archived
- **Setup**: 
  - Create project
  - Set up repository and subscriber
  - Subscribe to "PROJECT_ARCHIVED" event
- **Action**: Archive project using use case
- **Assertion**: 
  - Event is captured and not null
  - Event type is "PROJECT_ARCHIVED"
- **Event System Test**: Verifies event emission for state transitions

---

### 5. `restore-project.test.ts`

**Purpose**: Tests restoring archived projects to active state.

#### Test Cases

**Test 1: Cannot restore deleted project**
- **Purpose**: Validates that deleted projects cannot be restored
- **Setup**: Create project and delete it
- **Action**: Attempt to restore deleted project
- **Assertion**: 
  - Project status is "deleted"
  - Throws error "Project is deleted"
- **Invariant Tested**: Deleted projects cannot be modified

**Test 2: Restoring emits PROJECT_RESTORED event**
- **Purpose**: Validates event emission when project is restored
- **Setup**: 
  - Create project and archive it
  - Set up repository and subscriber
  - Subscribe to "PROJECT_RESTORED" event
- **Action**: Restore project using use case
- **Assertion**: 
  - Event is captured and not null
  - Event type is "PROJECT_RESTORED"
- **Lifecycle Test**: Validates archived → active transition
- **Event System Test**: Verifies event emission for restoration

---

### 6. `rename-project.test.ts`

**Purpose**: Tests project renaming functionality and event emission.

#### Test Cases

**Test 1: Cannot rename deleted project**
- **Purpose**: Validates that deleted projects cannot be renamed
- **Setup**: Create project and delete it
- **Action**: Attempt to rename deleted project
- **Assertion**: 
  - Project status is "deleted"
  - Throws error "Project is deleted"
- **Invariant Tested**: Deleted projects cannot be modified

**Test 2: Renaming emits PROJECT_RENAMED event**
- **Purpose**: Validates event emission when project is renamed
- **Setup**: 
  - Create project
  - Set up repository and subscriber
  - Subscribe to "PROJECT_RENAMED" event
- **Action**: Rename project using use case
- **Assertion**: 
  - Event is captured and not null
  - Event type is "PROJECT_RENAMED"
- **Event System Test**: Verifies event emission for property changes

---

### 7. `delete-project.test.ts`

**Purpose**: Tests project deletion functionality, including business rules and event emission.

#### Test Cases

**Test 1: Cannot delete project if already deleted**
- **Purpose**: Validates that deleted projects cannot be deleted again
- **Setup**: Create project and delete it
- **Action**: Attempt to delete project again
- **Assertion**: 
  - Project status is "deleted"
  - Throws error "Project is deleted"
- **Invariant Tested**: Deleted projects cannot be modified

**Test 2: Cannot delete project with active tasks**
- **Purpose**: Validates that projects with active tasks cannot be deleted
- **Setup**: Create project
- **Action**: Attempt to delete project with active tasks (hasActiveTasks = true)
- **Assertion**: Throws error "Project cannot be deleted as it contains active tasks"
- **Invariant Tested**: Projects can only be deleted if no active tasks exist

**Test 3: Deleting emits PROJECT_DELETED event**
- **Purpose**: Validates event emission when project is deleted
- **Setup**: 
  - Create project
  - Set up repository and subscriber
  - Subscribe to "PROJECT_DELETED" event
- **Action**: Delete project using use case (with no active tasks)
- **Assertion**: 
  - Event is captured and not null
  - Event type is "PROJECT_DELETED"
- **Lifecycle Test**: Validates active → deleted transition
- **Event System Test**: Verifies event emission for deletion

---

## Workspace Domain Tests

**Location**: `src/testing/jest-test/workspaceDomain-testcases/`

### 1. `workspace-creation.test.ts`

**Purpose**: Tests workspace creation and initial state validation.

#### Test Cases

**Test 1: Should create a workspace**
- **Purpose**: Validates workspace creation with owner
- **Setup**: Owner ID, workspace name, and description
- **Action**: Create workspace using static factory method
- **Assertion**: 
  - Workspace has exactly 1 member
- **Invariant Tested**: Workspace must have at least one owner

---

### 2. `workspace-hastowner.test.ts`

**Purpose**: Tests that workspace creation includes an owner.

#### Test Cases

**Test 1: Should create workspace with at least one owner**
- **Purpose**: Validates that created workspace has an owner
- **Setup**: Owner ID, workspace name, and description
- **Action**: Create workspace
- **Assertion**: 
  - Workspace has 1 user ID
  - First user ID matches owner ID
  - First member has role "owner"
- **Invariant Tested**: Workspace must have at least one owner

---

### 3. `workspace-addMemeber.test.ts`

**Purpose**: Tests adding members to workspaces and event emission.

#### Test Cases

**Test 1: Should add a member to the workspace**
- **Purpose**: Validates member addition and event emission
- **Setup**: 
  - Create workspace with owner
  - Set up repository and use case
  - Subscribe to "WORKSPACE_MEMBER_ADDED" event
- **Action**: Add member using use case
- **Assertion**: 
  - Workspace has 2 members
  - New member has role "member"
  - Original member has role "owner"
  - Workspace has 2 user IDs
  - Event is captured with type "WORKSPACE_MEMBER_ADDED"
- **Event System Test**: Verifies event emission for member addition
- **Authorization Test**: Validates owner can add members

---

### 4. `remove-memberWorkspace.test.ts`

**Purpose**: Tests removing members from workspaces.

#### Test Cases

**Test 1: Should remove a member from workspace**
- **Purpose**: Validates member removal functionality
- **Setup**: 
  - Create workspace with owner
  - Add a member
  - Set up repository and use case
  - Subscribe to "WORKSPACE_MEMBER_REMOVED" event
- **Action**: Remove member using use case
- **Assertion**: 
  - Workspace has 1 member after removal
  - Event is captured with type "WORKSPACE_MEMBER_REMOVED"
- **Event System Test**: Verifies event emission for member removal
- **Authorization Test**: Validates owner can remove members

---

### 5. `delete-workspace.test.ts`

**Purpose**: Tests workspace deletion with comprehensive business rule validation.

#### Test Cases

**Test 1: Cannot delete workspace if already deleted**
- **Purpose**: Validates that deleted workspaces cannot be deleted again
- **Setup**: Create workspace and delete it
- **Action**: Attempt to delete workspace again
- **Assertion**: Throws error "Workspace is deleted and cannot be modified"
- **Invariant Tested**: Deleted workspaces cannot be modified

**Test 2: Workspace can only be deleted by owner**
- **Purpose**: Validates authorization for workspace deletion
- **Setup**: Create workspace with owner, use non-owner ID
- **Action**: Attempt to delete workspace with non-owner ID
- **Assertion**: Throws error "Only Owner can perform this action"
- **Authorization Test**: Validates owner-only deletion rule

**Test 3: Workspace cannot be deleted with active tasks**
- **Purpose**: Validates that workspaces with active tasks cannot be deleted
- **Setup**: Create workspace, indicate active tasks exist
- **Action**: Attempt to delete workspace with active tasks
- **Assertion**: Throws error "Workspace has active or in progress tasks and cannot be deleted"
- **Invariant Tested**: Workspaces cannot be deleted if they have active tasks

**Test 4: Deleting emits WORKSPACE_DELETED event**
- **Purpose**: Validates event emission when workspace is deleted
- **Setup**: 
  - Create workspace
  - Set up repository and subscriber
  - Subscribe to "WORKSPACE_DELETED" event
- **Action**: Delete workspace using use case (with no active tasks)
- **Assertion**: 
  - Workspace status is "deleted"
  - Event is captured with type "WORKSPACE_DELETED"
- **Lifecycle Test**: Validates active → deleted transition
- **Event System Test**: Verifies event emission for deletion

---

### 6. `workspace-noOwnerpresent.test.ts`

**Purpose**: Tests workspace behavior when no owner is present.

#### Test Cases

**Test 1: Workspace must have at least one owner**
- **Purpose**: Validates the invariant that workspace must have an owner
- **Setup**: Create workspace
- **Action**: Verify workspace has owner
- **Assertion**: Workspace has at least one owner
- **Invariant Tested**: Workspace must have at least one owner

---

## User Domain Tests

**Location**: `src/testing/jest-test/userDomain/`

### 1. `User.test.ts`

**Purpose**: Tests user creation, lifecycle management, and state transitions.

#### Test Cases

**Test 1: User should be created with valid email and name**
- **Purpose**: Validates user creation validation
- **Setup**: Empty email, valid name
- **Action**: Attempt to create user with empty email
- **Assertion**: Throws error "Email and name are required"
- **Invariant Tested**: User must have email and name

**Test 2: Cannot suspend deleted user**
- **Purpose**: Validates that deleted users cannot be suspended
- **Setup**: Create user and delete it
- **Action**: Attempt to suspend deleted user
- **Assertion**: Throws error "User is deleted and cannot be modified"
- **Invariant Tested**: Deleted users cannot be modified

**Test 3: Cannot activate active user**
- **Purpose**: Validates that only suspended users can be activated
- **Setup**: Create active user
- **Action**: Attempt to activate active user
- **Assertion**: Throws error "User is not suspended"
- **Lifecycle Test**: Validates state transition rules (only suspended → active)

**Test 4: Delete a user**
- **Purpose**: Validates user deletion
- **Setup**: Create user
- **Action**: Delete user
- **Assertion**: User status is "deleted"
- **Lifecycle Test**: Validates active → deleted transition

---

## Test Patterns and Conventions

### Test Structure

All tests follow the **Arrange-Act-Assert (AAA)** pattern:

```typescript
describe("Test Suite", () => {
    test('test description', () => {
        // Arrange (Setup)
        const entity = Domain.create(...);
        
        // Act
        entity.operation();
        
        // Assert
        expect(entity['props'].status).toBe("expected");
    })
})
```

### Fake Repositories

Tests use in-memory fake repositories that implement the same interface as real repositories:

```typescript
class fakeProjectRepository {
    private projects: Record<string, ProjectDomain> = {};
    
    findById(id: string): Promise<ProjectDomain | null> {
        return Promise.resolve(this.projects[id] || null);
    }
    
    save(project: ProjectDomain): Promise<void> {
        this.projects[project['props'].id] = project;
        return Promise.resolve();
    }
}
```

### Event Testing Pattern

Event tests follow a consistent pattern:

```typescript
// 1. Subscribe to event
let capturedEvent: any = null;
eventBus.subscribe("EVENT_TYPE", async (event: any) => {
    capturedEvent = event;
    await subscriber.handle(capturedEvent);
});

// 2. Execute use case
await useCase.execute(command);

// 3. Assert event was emitted
expect(capturedEvent).not.toBeNull();
expect(capturedEvent.type).toBe("EVENT_TYPE");
```

### Helper Methods

Some test repositories include helper methods for easier assertions:

```typescript
// Helper to get task IDs
getTaskIds(projectId: string): string[] {
    const project = this.projects[projectId];
    return project ? project['props'].taskIds : [];
}

// Helper to check task existence
hasTask(projectId: string, taskId: string): boolean {
    const taskIds = this.getTaskIds(projectId);
    return taskIds.includes(taskId);
}
```

---

## Test Coverage Summary

### Project Domain
- ✅ Creation with validation
- ✅ State transitions (archive, restore, delete)
- ✅ Task management (add, remove)
- ✅ Invariant enforcement (deleted state, archived state)
- ✅ Event emission for all operations

### Workspace Domain
- ✅ Creation with owner validation
- ✅ Member management (add, remove)
- ✅ Authorization (owner-only operations)
- ✅ Deletion with business rules
- ✅ Event emission for all operations

### User Domain
- ✅ Creation with validation
- ✅ Lifecycle management (suspend, activate, delete)
- ✅ State transition validation
- ✅ Invariant enforcement

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test addTask-project.test.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

---

## Test Maintenance

### Adding New Tests

When adding new tests:
1. Follow the AAA pattern
2. Use descriptive test names
3. Test both success and failure cases
4. Include event emission tests for domain operations
5. Use fake repositories for isolation
6. Document the purpose of each test

### Test File Naming

Test files follow the convention:
- `{operation}-{domain}.test.ts` (e.g., `addTask-project.test.ts`)
- `{domain}-{feature}.test.ts` (e.g., `workspace-creation.test.ts`)

---

## Notes

- All tests use Jest as the testing framework
- Tests are isolated and do not depend on external services
- Fake repositories provide in-memory storage for testing
- Event bus is a singleton shared across tests (may require cleanup in some scenarios)
- Tests verify both business logic and event system integration

