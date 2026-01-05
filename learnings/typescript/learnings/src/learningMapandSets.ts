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

