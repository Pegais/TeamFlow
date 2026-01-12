import registerSubscribers from "../event-Subscribers/registerSubscriber";

registerSubscribers();

console.log("Teamflow is running");

//create repository
import inMemoryWorkspaceRepository from "../../infra/repository/in-memory/inMemoryWorkspaceRepo"
import inMemorrProjectRepository from "../../infra/repository/in-memory/inMemoryProjectRepo"