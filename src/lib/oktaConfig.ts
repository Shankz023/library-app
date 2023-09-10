export const oktaConfig={
    clientId: '0oaaatr4v4Xpzg5YJ5d7',
    issuer: 'https://dev-00541124.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scope: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}