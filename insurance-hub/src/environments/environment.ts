export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  keycloakUrl: 'http://localhost:8180',
  keycloakRealm: 'insurance-hub',
  keycloakClientId: 'insurance-hub-frontend',
  kafkaWebSocket: 'ws://localhost:8085/ws',
  useMockData: true, // Use mock data when backend is not available
  version: '1.0.0'
};
