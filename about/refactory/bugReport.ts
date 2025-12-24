// Correct DDD Fix (not a workaround)
// Key principle

// A workspace must be created with at least one owner

// This means:

// members[] should never be empty after creation

// Ownership is a construction invariant, not a runtime check

/**
 * Sample correct log output for the add workspace member use case :
 * workspace: WorkspaceDomain {
  domainEvents: [],
  props: {
    name: 'workspace 1',
    description: 'workspace 1 description',
    id: 'd5159438-eb11-44b6-b03a-5f3549d291fa',
    members: [ [Object] ],
    createdAt: 2025-12-24T11:55:45.960Z,
    updatedAt: 2025-12-24T11:55:45.960Z,
    deletedAt: null,
    status: 'active',
    creatorId: 'user1',
    userids: [ 'user1' ],
    taskids: [],
    projectids: []
  }
}
workspace saved WorkspaceDomain {
  domainEvents: [
    {
      type: 'WORKSPACE_MEMBER_ADDED',
      occuredAt: 2025-12-24T11:55:45.963Z,
      workspaceId: 'd5159438-eb11-44b6-b03a-5f3549d291fa',
      userId: 'user2'
    }
  ],
  props: {
    name: 'workspace 1',
    description: 'workspace 1 description',
    id: 'd5159438-eb11-44b6-b03a-5f3549d291fa',
    members: [ [Object], [Object] ],
    createdAt: 2025-12-24T11:55:45.960Z,
    updatedAt: 2025-12-24T11:55:45.963Z,
    deletedAt: null,
    status: 'active',
    creatorId: 'user1',
    userids: [ 'user1', 'user2' ],
    taskids: [],
    projectids: []
  }
}
 */