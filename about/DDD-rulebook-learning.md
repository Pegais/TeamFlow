# 🧩 Domain Object Lifecycle Rules

A guide to understanding when and where domain rules should be enforced in Domain-Driven Design.

---

## Overview

Domain objects go through distinct lifecycle phases, each with its own rules and enforcement patterns:

| Phase | Purpose | Enforcement Location |
|-------|---------|---------------------|
| Pre-creation | Birth rules | Static factory methods |
| Post-creation | Operational rules | Instance methods + guards |
| Terminal | End-of-life rules | State-based guards |

---

## 1️⃣ Pre-creation (Birth Rules)

> Rules that define whether an object is **allowed to exist at all**.

### Examples

- A Workspace **must** have at least one owner
- A User **must** have an email
- A Project **must** belong to a workspace

### Why This Matters

These rules **cannot** live in instance methods because the instance does not exist yet.

### ✅ Where They Belong

Use **static factory methods**:

```typescript
WorkspaceDomain.create(ownerId)
UserDomain.register(email, password)
ProjectDomain.create(name, workspaceId)
```

---

## 2️⃣ Post-creation (Operational Rules)

> Rules that apply **after** the object exists.

### Examples

- Only owners can add members
- Cannot remove the last owner
- Cannot delete workspace with active tasks

### Why This Matters

These rules enforce business invariants during the object's active lifecycle.

### ✅ Where They Belong

Use **instance methods + guards**:

```typescript
workspace.addMember(...)
workspace.removeMember(...)
workspace.deleteWorkspace(...)
```

---

## 3️⃣ Terminal Rules (End-of-Life)

> Rules that apply when the domain is **deleted / archived / frozen**.

### Examples

- Deleted workspace cannot be modified
- Archived project cannot accept tasks

### ✅ Where They Belong

Use **state-based guards**:

```typescript
ensureNotDeleted()
ensureNotArchived()
```

---

## Decision Flowchart

Use these questions to determine where your rules belong:

| Question | Answer | Action |
|----------|--------|--------|
| Can this object exist in an invalid state at birth? | ❌ Yes | Use a **static factory** |
| Can this object exist in an invalid state at birth? | ✅ No | Constructor is fine |
| Do some rules only make sense after creation? | ✅ Yes | Use **instance guards** |
| Does this object have a lifecycle (active → archived → deleted)? | ✅ Yes | Add **state-based guards** |
| Can I prevent invalid states entirely instead of checking later? | ✅ Yes | Prefer **prevention over correction** |

---

## Architecture Diagram

```
┌──────────────────┐
│  Static Factory  │  ← birth rules
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Domain Object   │  ← operational rules (guards)
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Domain Events   │  ← reactions, decoupling
└──────────────────┘
```

---

## Key Takeaways

1. **Static factories** protect birth invariants — use them when objects cannot exist in invalid states
2. **Instance guards** protect operational invariants — enforce rules during the object's active life
3. **State guards** protect terminal invariants — prevent actions on deleted/archived objects
4. **Prefer prevention over correction** — design APIs that make invalid states unrepresentable
