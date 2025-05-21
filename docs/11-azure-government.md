# 🏛️ Azure Government Cloud Deployment

This guide explains how to deploy AzureChat to Azure Government Cloud.

## Considerations for Azure Government

When deploying to Azure Government Cloud, there are several important differences to be aware of:

1. **Limited AI Services**: Some Azure OpenAI capabilities like DALL-E and Vision are not available in Azure Government regions. The deployment has been configured to automatically disable these features.

2. **Different Endpoints**: Azure Government uses different endpoints for services like Azure AD, OpenAI, Cognitive Services, Storage, etc. The application has been modified to use the correct Government cloud endpoints.

3. **Regions**: Azure Government has a different set of available regions. When prompted during deployment, make sure to select a region that is available in Azure Government.

## Deployment Instructions

The deployment process for Azure Government is similar to the standard deployment process, with a few key differences.

### Option 1: Azure Developer CLI (azd)

1. Download the [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview)

2. Login to Azure Government:
   ```bash
   az cloud set --name AzureUSGovernment
   az login
   ```

3. Initialize and deploy:
   ```bash
   azd init -t microsoft/azurechat  # If you haven't cloned the repo
   # OR
   azd init  # If you've already cloned the repo
   
   azd up  # Deploy the application
   ```

The deployment process has been pre-configured for Azure Government. You'll still be prompted for:
- Environment name
- Azure Subscription
- Azure location (select a Government region)
- OpenAI location (select a Government region that supports OpenAI)
- Whether to disable local authentication (recommended to use Managed Identities)
- Whether to use private endpoints

### Option 2: GitHub Actions

To deploy using GitHub Actions to Azure Government, follow the standard [Deploy to Azure](./4-deploy-to-azure.md) instructions, with these additional steps:

1. When creating the Service Principal, make sure you're connected to the Azure Government cloud:
   ```bash
   az cloud set --name AzureUSGovernment
   az login
   ```

2. Create the Service Principal as described in the standard documentation.

## Identity Provider Configuration

When configuring the identity provider for Azure Government, be aware of the following differences:

### For Entra ID Authentication:

1. Use the Azure Government portal: https://portal.azure.us
2. When configuring redirect URIs, use the `.azurewebsites.us` domain for your web app

### For GitHub Authentication:

GitHub authentication works the same way with Azure Government, but you'll need to use the correct redirect URI with the `.azurewebsites.us` domain.

## Troubleshooting

Common issues when deploying to Azure Government:

1. **Authentication Issues**: Make sure you're using the correct Azure AD endpoints for Government cloud
2. **Service Availability**: Check that the services you're trying to use are available in your selected Government region
3. **Endpoint Configuration**: If you see "Connection Refused" errors, it might be due to incorrect endpoint configuration

For more help, refer to the [Azure Government documentation](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-get-started-connect-with-cli). 