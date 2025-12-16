//What membership domain is about:
/**
 * Protects owner safety.
 * Enforcing role invariants.
 * control promotions and demotions if any.
 * Ensure workspace always has atleast one owner.
 */

import type { WorkspaceRole } from "../../coretruthDomain/user/workspaceDomains/workspace/workspace.types";

export interface MembershipProps{
    userId:string;
    role:WorkspaceRole;
}