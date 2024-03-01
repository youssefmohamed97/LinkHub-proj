import SamlAuthProvider from '../../models/saml-auth-provider.ee.js';

const listSamlAuthProviders = async () => {
  const providers = await SamlAuthProvider.query().where({ active: true });

  return providers;
};

export default listSamlAuthProviders;
