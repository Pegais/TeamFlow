/**
 * ============================================
 * LEARNING: MAPS AND SETS IN TYPESCRIPT
 * ============================================
 * 
 * This file contains comprehensive learning material about Maps and Sets,
 * including all operations, examples, and real-world application scenarios.
 */

// ============================================
// PART 1: MAPS
// ============================================

/**
 * Q1: What is a Map?
 * 
 * A Map is a collection of key-value pairs where both keys and values can be of any type.
 * Unlike objects, Maps maintain insertion order and have better performance for frequent
 * additions and deletions.
 * 
 * Key differences from objects:
 * - Maps can have keys of any type (objects, functions, primitives)
 * - Maps have a size property
 * - Maps maintain insertion order
 * - Maps are iterable by default
 * - Better performance for frequent additions/deletions
 */

// Example: Creating a Map
const userRolesMap = new Map<string, string>();

/**
 * Q2: How to create and initialize a Map?
 * 
 * You can create an empty Map or initialize it with key-value pairs.
 */

// Method 1: Empty Map
const emptyMap = new Map();

// Method 2: Initialize with array of [key, value] pairs
const initializedMap = new Map([
    ['userId1', 'owner'],
    ['userId2', 'teamhead'],
    ['userId3', 'member']
]);

console.log('Initialized Map:', initializedMap);
// Output: Map(3) { 'userId1' => 'owner', 'userId2' => 'teamhead', 'userId3' => 'member' }

/**
 * Q3: How to add/update values in a Map?
 * 
 * Use the set() method to add or update key-value pairs.
 */

const workspaceMap = new Map<string, { name: string; status: string }>();

// Adding new entries
workspaceMap.set('workspace-1', { name: 'Project Alpha', status: 'active' });
workspaceMap.set('workspace-2', { name: 'Project Beta', status: 'active' });

// Updating existing entry (same key)
workspaceMap.set('workspace-1', { name: 'Project Alpha Updated', status: 'active' });

console.log('Workspace Map:', workspaceMap);

/**
 * Q4: How to get values from a Map?
 * 
 * Use the get() method with the key to retrieve the value.
 */

const role = initializedMap.get('userId1');
console.log('Role for userId1:', role); // Output: 'owner'

const workspace = workspaceMap.get('workspace-1');
console.log('Workspace details:', workspace); // Output: { name: 'Project Alpha Updated', status: 'active' }

// If key doesn't exist, get() returns undefined
const nonExistent = initializedMap.get('userId999');
console.log('Non-existent key:', nonExistent); // Output: undefined

/**
 * Q5: How to check if a key exists in a Map?
 * 
 * Use the has() method to check if a key exists. It returns true or false.
 * This is like asking "Does this key exist in my Map?"
 */

const taskStatusMap = new Map<string, string>();
taskStatusMap.set('task-1', 'completed');
taskStatusMap.set('task-2', 'in-progress');

// Check if key exists
const hasTask1 = taskStatusMap.has('task-1');
console.log('Does task-1 exist?', hasTask1); // Output: true

const hasTask3 = taskStatusMap.has('task-3');
console.log('Does task-3 exist?', hasTask3); // Output: false

// Real example: Check before getting a value
if (taskStatusMap.has('task-1')) {
    const status = taskStatusMap.get('task-1');
    console.log('Task-1 status:', status); // Output: 'completed'
}

/**
 * Q6: How to delete an entry from a Map?
 * 
 * Use the delete() method with the key you want to remove.
 * It returns true if the key existed and was deleted, false if the key didn't exist.
 */

const projectMap = new Map<string, string>();
projectMap.set('project-1', 'Website Redesign');
projectMap.set('project-2', 'Mobile App');
projectMap.set('project-3', 'API Development');

console.log('Before delete:', projectMap.size); // Output: 3

// Delete an entry
const deleted = projectMap.delete('project-2');
console.log('Was project-2 deleted?', deleted); // Output: true
console.log('After delete:', projectMap.size); // Output: 2

// Try to delete something that doesn't exist
const notDeleted = projectMap.delete('project-999');
console.log('Was project-999 deleted?', notDeleted); // Output: false

/**
 * Q7: How to get the size (number of entries) of a Map?
 * 
 * Use the size property. It tells you how many key-value pairs are in the Map.
 * Think of it like counting items in a box.
 */

const userMap = new Map<string, { name: string; email: string }>();
userMap.set('user-1', { name: 'Alice', email: 'alice@example.com' });
userMap.set('user-2', { name: 'Bob', email: 'bob@example.com' });
userMap.set('user-3', { name: 'Charlie', email: 'charlie@example.com' });

console.log('Number of users:', userMap.size); // Output: 3

// Size updates automatically when you add or delete
userMap.set('user-4', { name: 'Diana', email: 'diana@example.com' });
console.log('Number of users after adding:', userMap.size); // Output: 4

userMap.delete('user-1');
console.log('Number of users after deleting:', userMap.size); // Output: 3

/**
 * Q8: How to clear all entries from a Map?
 * 
 * Use the clear() method to remove all entries at once.
 * After clearing, the Map will be empty (size will be 0).
 */

const tempMap = new Map<string, number>();
tempMap.set('item1', 10);
tempMap.set('item2', 20);
tempMap.set('item3', 30);

console.log('Before clear:', tempMap.size); // Output: 3

tempMap.clear(); // Remove everything

console.log('After clear:', tempMap.size); // Output: 0
console.log('Is map empty?', tempMap.size === 0); // Output: true

/**
 * Q9: How to loop through a Map using forEach?
 * 
 * forEach() lets you visit each key-value pair in the Map.
 * It's like going through each item one by one and doing something with it.
 */

const notificationMap = new Map<string, { message: string; read: boolean }>();
notificationMap.set('notif-1', { message: 'New task assigned', read: false });
notificationMap.set('notif-2', { message: 'Workspace updated', read: true });
notificationMap.set('notif-3', { message: 'New member joined', read: false });

// Loop through and do something with each entry
notificationMap.forEach((value, key) => {
    console.log(`Notification ${key}: ${value.message} - Read: ${value.read}`);
});
// Output:
// Notification notif-1: New task assigned - Read: false
// Notification notif-2: Workspace updated - Read: true
// Notification notif-3: New member joined - Read: false

// Example: Count unread notifications
let unreadCount = 0;
notificationMap.forEach((value) => {
    if (!value.read) {
        unreadCount++;
    }
});
console.log('Unread notifications:', unreadCount); // Output: 2

/**
 * Q10: How to loop through a Map using for...of?
 * 
 * You can use for...of loop to iterate through a Map.
 * This gives you access to [key, value] pairs in each iteration.
 */

const teamMap = new Map<string, string>();
teamMap.set('user-1', 'Alice');
teamMap.set('user-2', 'Bob');
teamMap.set('user-3', 'Charlie');

// Loop through entries (each entry is [key, value])
for (const [userId, userName] of teamMap) {
    console.log(`${userId} is ${userName}`);
}
// Output:
// user-1 is Alice
// user-2 is Bob
// user-3 is Charlie

// You can also use entries() method explicitly (it's the same)
for (const [userId, userName] of teamMap.entries()) {
    console.log(`Team member: ${userName} (ID: ${userId})`);
}

/**
 * Q11: How to get all keys from a Map?
 * 
 * Use the keys() method to get an iterator of all keys.
 * Useful when you only need the keys, not the values.
 */

const workspaceUsersMap = new Map<string, string>();
workspaceUsersMap.set('user-1', 'owner');
workspaceUsersMap.set('user-2', 'teamhead');
workspaceUsersMap.set('user-3', 'member');
workspaceUsersMap.set('user-4', 'member');

// Get all keys as an array
const allUserIds = Array.from(workspaceUsersMap.keys());
console.log('All user IDs:', allUserIds);
// Output: ['user-1', 'user-2', 'user-3', 'user-4']

// Loop through just the keys
for (const userId of workspaceUsersMap.keys()) {
    console.log('User ID:', userId);
}

// Example: Check if a user exists in workspace
const userIdToCheck = 'user-2';
if (allUserIds.includes(userIdToCheck)) {
    console.log(`${userIdToCheck} is in the workspace`);
}

/**
 * Q12: How to get all values from a Map?
 * 
 * Use the values() method to get an iterator of all values.
 * Useful when you only need the values, not the keys.
 */

// Get all values as an array
const allRoles = Array.from(workspaceUsersMap.values());
console.log('All roles:', allRoles);
// Output: ['owner', 'teamhead', 'member', 'member']

// Loop through just the values
for (const role of workspaceUsersMap.values()) {
    console.log('Role:', role);
}

// Example: Count how many members have a specific role
const memberCount = allRoles.filter(role => role === 'member').length;
console.log('Number of members:', memberCount); // Output: 2

/**
 * Q13: How to get all entries (key-value pairs) from a Map?
 * 
 * Use the entries() method to get an iterator of all [key, value] pairs.
 * This is useful when you need both keys and values together.
 */

const taskAssignmentsMap = new Map<string, string>();
taskAssignmentsMap.set('task-1', 'user-1');
taskAssignmentsMap.set('task-2', 'user-2');
taskAssignmentsMap.set('task-3', 'user-1');

// Get all entries as an array
const allAssignments = Array.from(taskAssignmentsMap.entries());
console.log('All task assignments:', allAssignments);
// Output: [['task-1', 'user-1'], ['task-2', 'user-2'], ['task-3', 'user-1']]

// Loop through entries
for (const [taskId, userId] of taskAssignmentsMap.entries()) {
    console.log(`Task ${taskId} is assigned to ${userId}`);
}
// Output:
// Task task-1 is assigned to user-1
// Task task-2 is assigned to user-2
// Task task-3 is assigned to user-1

// Example: Find all tasks assigned to a specific user
const targetUserId = 'user-1';
const tasksForUser = allAssignments
    .filter(([taskId, userId]) => userId === targetUserId)
    .map(([taskId]) => taskId);
console.log(`Tasks for ${targetUserId}:`, tasksForUser);
// Output: ['task-1', 'task-3']

