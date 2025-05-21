import { OpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import { AzureOpenAI } from "openai";

const USE_MANAGED_IDENTITIES = process.env.USE_MANAGED_IDENTITIES === "true";
const ENABLE_DALLE = process.env.ENABLE_DALLE === "true";
const IS_AZURE_GOV = process.env.AZURE_GOV === "true";

// Set default endpoint suffix based on environment
const getDefaultEndpointSuffix = (service: string): string => {
  if (IS_AZURE_GOV) {
    switch (service) {
      case 'openai':
        return "openai.azure.us";
      case 'search':
        return "search.azure.us";
      case 'storage':
        return "core.usgovcloudapi.net";
      case 'keyvault':
        return "vault.usgovcloudapi.net";
      default:
        return `${service}.azure.us`;
    }
  }
  
  // Default commercial Azure endpoints
  switch (service) {
    case 'openai':
      return "openai.azure.com";
    case 'search':
      return "search.windows.net";
    case 'storage':
      return "core.windows.net";
    case 'keyvault':
      return "vault.azure.net";
    default:
      return `${service}.azure.com`;
  }
};

export const OpenAIInstance =  () => {
  const endpointSuffix = process.env.AZURE_OPENAI_API_ENDPOINT_SUFFIX || getDefaultEndpointSuffix('openai');
  let token = process.env.AZURE_OPENAI_API_KEY;
  if (USE_MANAGED_IDENTITIES) {
    const credential = new DefaultAzureCredential();
    const scope = IS_AZURE_GOV 
      ? "https://cognitiveservices.azure.us/.default"
      : "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(credential, scope);
    const deployment = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
    const client = new AzureOpenAI({
      azureADTokenProvider,
      deployment,
      apiVersion,
      baseURL: `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.${endpointSuffix}/openai/deployments/${process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME}`
    });
    return client;
  } else {
    const openai = new OpenAI({
      apiKey: token,
      baseURL: `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.${endpointSuffix}/openai/deployments/${process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME}`,
      defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
      defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
    });
    return openai;
  }
};

export const OpenAIEmbeddingInstance =  () => {
  const endpointSuffix = process.env.AZURE_OPENAI_API_ENDPOINT_SUFFIX || getDefaultEndpointSuffix('openai');
  let token = process.env.AZURE_OPENAI_API_KEY;
  if (USE_MANAGED_IDENTITIES) {
    const credential = new DefaultAzureCredential();
    const scope = IS_AZURE_GOV 
      ? "https://cognitiveservices.azure.us/.default"
      : "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(credential, scope);
    const deployment = process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
    const client = new AzureOpenAI({
      azureADTokenProvider,
      deployment,
      apiVersion,
      baseURL: `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.${endpointSuffix}/openai/deployments/${process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME}`
    });
    return client;
  } else {
    const openai = new OpenAI({
      apiKey: token,
      baseURL: `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.${endpointSuffix}/openai/deployments/${process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME}`,
      defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
      defaultHeaders: { "api-key": token },
    });
    return openai;
  }
};

// A new instance definition for DALL-E image generation
export const OpenAIDALLEInstance =  () => {
  // Return null if DALL-E is disabled
  if (!ENABLE_DALLE) {
    console.log("DALL-E functionality is disabled");
    return null;
  }

  const endpointSuffix = process.env.AZURE_OPENAI_API_ENDPOINT_SUFFIX || getDefaultEndpointSuffix('openai');
  let token = process.env.AZURE_OPENAI_DALLE_API_KEY;
  if (USE_MANAGED_IDENTITIES) {
    const credential = new DefaultAzureCredential();
    const scope = IS_AZURE_GOV 
      ? "https://cognitiveservices.azure.us/.default"
      : "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(credential, scope);
    const deployment = process.env.AZURE_OPENAI_DALLE_API_DEPLOYMENT_NAME;
    const apiVersion = process.env.AZURE_OPENAI_DALLE_API_VERSION || "2023-12-01-preview";
    const client = new AzureOpenAI({
      azureADTokenProvider,
      deployment,
      apiVersion,
      baseURL: `https://${process.env.AZURE_OPENAI_DALLE_API_INSTANCE_NAME}.${endpointSuffix}/openai/deployments/${process.env.AZURE_OPENAI_DALLE_API_DEPLOYMENT_NAME}`
    });
    return client;
  } else {
    const openai = new OpenAI({
      apiKey: token,
      baseURL: `https://${process.env.AZURE_OPENAI_DALLE_API_INSTANCE_NAME}.${endpointSuffix}/openai/deployments/${process.env.AZURE_OPENAI_DALLE_API_DEPLOYMENT_NAME}`,
      defaultQuery: { "api-version": process.env.AZURE_OPENAI_DALLE_API_VERSION || "2023-12-01-preview" },
      defaultHeaders: { "api-key": token },
    });
    return openai;
  }
};
