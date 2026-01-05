import WorkspaceDomain from "../../../domains/coretruthDomain/user/workspaceDomains/workspace/workspace";

/**
 * InMemoryWorkspaceRepo - In-Memory Repository for Workspaces
 * 
 * This class stores workspace data in memory using a Map data structure.
 * It's useful for development, testing, or when you don't need persistent storage.
 * 
 * Why use Map here?
 * - Fast lookups: O(1) time complexity to find a workspace by ID
 * - Easy to add/update/delete workspaces
 * - Maintains insertion order
 * - Better performance than arrays for frequent lookups
 */
class InMemoryWorkspaceRepo {
    // Store workspaces in a Map where:
    // - Key: workspace ID (string) - used to quickly find workspaces
    // - Value: WorkspaceDomain instance - the actual workspace object
    private store: Map<string, InstanceType<typeof WorkspaceDomain>>;

    /**
     * Constructor - Initialize the repository
     * Creates an empty Map to store workspaces when the repository is created
     */
    constructor() {
        // Create a new empty Map to store our workspaces
        // Think of it as an empty box that will hold workspace objects
        this.store = new Map();
    }

    /**
     * findById - Find a workspace by its ID
     * 
     * @param id - The unique identifier of the workspace to find
     * @returns The workspace if found, or null if not found
     * 
     * How it works:
     * 1. Uses Map.get() to look up the workspace by ID
     * 2. If found, returns the workspace
     * 3. If not found, get() returns undefined, so we use || null to return null instead
     */
    async findById(id: string): Promise<InstanceType<typeof WorkspaceDomain> | null> {
        // Try to get the workspace from the Map using its ID
        // If the ID exists, get() returns the workspace
        // If the ID doesn't exist, get() returns undefined
        // We use || null to convert undefined to null for consistency
        try {
            //validate the id
            if (!id || typeof id !== "string") {
                throw new Error("Invalid workspaceId is provided");
            }
            //get the workspace from the map
            const workspace = this.store.get(id);
            //return the workspace
            return workspace || null;
        } catch (error) {
            console.error(`Error in finding workspace by id: ${id} :`,error);
            throw error;
        }
  
    }

    /**
     * save - Save or update a workspace in the repository
     * 
     * @param workspace - The WorkspaceDomain instance to save
     * @returns Promise that resolves when the workspace is saved
     * 
     * How it works:
     * 1. Gets the workspace ID from workspace.props.id
     * 2. Uses Map.set() to store the workspace with its ID as the key
     * 3. If a workspace with the same ID already exists, it gets updated (overwritten)
     * 4. If it's a new ID, a new entry is created
     */
    async save(workspace: InstanceType<typeof WorkspaceDomain>): Promise<void> {
        // Get the workspace ID from the workspace's props object
        // workspace["props"].id accesses the id property inside the props object
        // This ID will be used as the key in our Map
        
        // Store the workspace in the Map:
        // - Key: workspace.props.id (the unique identifier)
        // - Value: workspace (the entire workspace object)
        // If a workspace with this ID already exists, it will be replaced (updated)
        // If it's a new ID, a new entry will be created
         try {
            if(!workspace) {
                throw new Error("Workspace is not valid or is null or undefined");
            }
            if(!workspace["props"] || !workspace["props"].id) {
                throw new Error("Workspace must have an valid id");
            }
            const workspaceId = workspace["props"].id;

            //validate ID is a string
            if(typeof workspaceId !== "string" || workspaceId.trim() === "") {
                throw new Error("Workspace ID must be a non-empty string");
            }
            //store the workspace in the map
            this.store.set(workspaceId, workspace);
            //return a resolved promise
            return Promise.resolve();
         } catch (error) {
            console.error(`Error in saving workspace: ${workspace["props"].id} :`,error);
            throw error;
         }
    }

}

export default InMemoryWorkspaceRepo;