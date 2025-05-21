import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const USE_MANAGED_IDENTITIES = process.env.USE_MANAGED_IDENTITIES === "true";
const IS_AZURE_GOV = process.env.AZURE_GOV === "true";
const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;
const endpointSuffix = process.env.AZURE_KEY_VAULT_ENDPOINT_SUFFIX || 
  (IS_AZURE_GOV ? "vault.usgovcloudapi.net" : "vault.azure.net");

let secretClient: SecretClient | null = null;

const getKVClient = () => {
  if (!secretClient) {
    if (!keyVaultName) {
      throw new Error("Azure Key Vault name is not defined.");
    }
    const keyVaultUrl = `https://${keyVaultName}.${endpointSuffix}`;
    try {
      secretClient = new SecretClient(keyVaultUrl, new DefaultAzureCredential());
    } catch (e) {
      console.error("Error creating Key Vault client:", e);
      throw e;
    }
  }
  return secretClient;
};

export const AzureKeyVaultInstance = () => {
  const credential = new DefaultAzureCredential();
  const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;

  if (!keyVaultName) {
    throw new Error(
      "Azure Key vault is not configured correctly, check environment variables."
    );
  }
  const endpointSuffix = process.env.AZURE_KEY_VAULT_ENDPOINT_SUFFIX || "vault.azure.net";
  const url = `https://${keyVaultName}.${endpointSuffix}`;

  return new SecretClient(url, credential);
};
