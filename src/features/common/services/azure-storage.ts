import { BlobServiceClient, RestError, StorageSharedKeyCredential } from "@azure/storage-blob";
import { ServerActionResponse } from "../server-action-response";
import { DefaultAzureCredential } from "@azure/identity";

// initialize the blobServiceClient
const USE_MANAGED_IDENTITIES = process.env.USE_MANAGED_IDENTITIES === "true";
const IS_AZURE_GOV = process.env.AZURE_GOV === "true";
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const endpointSuffix = process.env.AZURE_STORAGE_ENDPOINT_SUFFIX || 
  (IS_AZURE_GOV ? "core.usgovcloudapi.net" : "core.windows.net");

export const AzureStorageBlobServiceInstance = (): BlobServiceClient => {
  let blobServiceClient: BlobServiceClient;

  if (USE_MANAGED_IDENTITIES) {
    const credential = new DefaultAzureCredential();
    blobServiceClient = new BlobServiceClient(
      `https://${accountName}.${endpointSuffix}`,
      credential
    );
  } else {
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName!,
      accountKey!
    );
    blobServiceClient = new BlobServiceClient(
      `https://${accountName}.${endpointSuffix}`,
      sharedKeyCredential
    );
  }

  return blobServiceClient;
};

export const UploadBlob = async (
  containerName: string,
  blobName: string,
  blobData: Buffer
): Promise<ServerActionResponse<string>> => {
  const blobServiceClient = AzureStorageBlobServiceInstance();

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const response = await blockBlobClient.uploadData(blobData);

  // Check for upload success
  if (response.errorCode !== undefined) {
    return {
      status: "ERROR",
      errors: [
        {
          message: `Error uploading blob to storage: ${response.errorCode}`,
        },
      ],
    };
  }
  return {
    status: "OK",
    response: blockBlobClient.url,
  };
};

export const GetBlob = async (
  containerName: string,
  blobPath: string
): Promise<ServerActionResponse<ReadableStream<any>>> => {
  const blobServiceClient = AzureStorageBlobServiceInstance();

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

  try {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    // Passes stream to caller to decide what to do with
    if (!downloadBlockBlobResponse.readableStreamBody) {
      return {
        status: "ERROR",
        errors: [
          {
            message: `Error downloading blob: ${blobPath}`,
          },
        ],
      };
    }

    return {
      status: "OK",
      response:
        downloadBlockBlobResponse.readableStreamBody as unknown as ReadableStream<any>,
    };
  } catch (error) {
    if (error instanceof RestError) {
      const restError = error as RestError;
      if (restError.statusCode === 404) {
        return {
          status: "NOT_FOUND",
          errors: [
            {
              message: `Blob not found: ${blobPath}`,
            },
          ],
        };
      }
    }

    return {
      status: "ERROR",
      errors: [
        {
          message: `Error downloading blob: ${blobPath}`,
        },
      ],
    };
  }
};
