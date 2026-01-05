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

