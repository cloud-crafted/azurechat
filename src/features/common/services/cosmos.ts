import { Container, CosmosClient, Database, Resource } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

// Configuration
const DB_NAME = process.env.AZURE_COSMOSDB_DB_NAME || "chat";
const CONTAINER_NAME = process.env.AZURE_COSMOSDB_CONTAINER_NAME || "history";
const CONFIG_CONTAINER_NAME = process.env.AZURE_COSMOSDB_CONFIG_CONTAINER_NAME || "config";
const USE_MANAGED_IDENTITIES = process.env.USE_MANAGED_IDENTITIES === "true";
const IS_AZURE_GOV = process.env.AZURE_GOV === "true";

// Initialize the Cosmos client
const getCosmosClient = () => {
  let cosmosClient;
  if (USE_MANAGED_IDENTITIES) {
    const credential = new DefaultAzureCredential();
    const key = process.env.AZURE_COSMOSDB_KEY;
    cosmosClient = new CosmosClient({
      endpoint: process.env.AZURE_COSMOSDB_URI as string,
      aadCredentials: credential,
    });
  } else {
    const endpoint = process.env.AZURE_COSMOSDB_URI;
    const key = process.env.AZURE_COSMOSDB_KEY;
    if (!endpoint) {
      throw new Error(
        "Azure Cosmos DB endpoint is not configured. Please configure it in the .env file."
      );
    }
    cosmosClient = new CosmosClient({ endpoint, key });
  }
  return cosmosClient;
};

export const CosmosInstance = () => {
  const endpoint = process.env.AZURE_COSMOSDB_URI;

  if (!endpoint) {
    throw new Error(
      "Azure Cosmos DB endpoint is not configured. Please configure it in the .env file."
    );
  }

  const credential = getCosmosClient();
  if (credential instanceof DefaultAzureCredential) {
    return new CosmosClient({ endpoint, aadCredentials: credential });
  } else {
    return new CosmosClient({ endpoint, key: credential });
  }
};

export const ConfigContainer = () => {
  const client = CosmosInstance();
  const database = client.database(DB_NAME);
  const container = database.container(CONFIG_CONTAINER_NAME);
  return container;
};

export const HistoryContainer = () => {
  const client = CosmosInstance();
  const database = client.database(DB_NAME);
  const container = database.container(CONTAINER_NAME);
  return container;
};
