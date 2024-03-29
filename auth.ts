import msal from '@azure/msal-node';

interface TokenRequest {
  scopes: string[];
}

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_APP_ID,
    authority: process.env.AAD_ENDPOINT + '/' + process.env.AZURE_TENANT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET
  }
};

/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource>/.default'. For more, visit:
 * https://learn.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
 */
export const tokenRequest = {
  scopes: [process.env.GRAPH_ENDPOINT + '/.default']
};

export const apiConfig = {
  uri: `${process.env.GRAPH_ENDPOINT}/v1.0/sites/${process.env.SITE_ID}/drive/root:/AI tools/TEAMIT-AI-POC-TESTIKANSIO:/children`,
  test: `${process.env.GRAPH_ENDPOINT}/v1.0/sites/oyteamit.sharepoint.com:/sites/TeamTeamit/SitePages/Henkil%C3%B6st%C3%B6opas.aspx`
};

/**
 * Initialize a confidential client application. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */
const cca = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest
 */
export async function getToken(tokenRequest: TokenRequest) {
  return await cca.acquireTokenByClientCredential(tokenRequest);
}
