import { describe, it, expect, beforeEach } from 'vitest';
import { createSamlAuthProvider } from '../../test/factories/saml-auth-provider.ee.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';

describe('samlAuthProviderSerializer', () => {
  let samlAuthProvider;

  beforeEach(async () => {
    samlAuthProvider = await createSamlAuthProvider();
  });

  it('should return saml auth provider data', async () => {
    const expectedPayload = {
      id: samlAuthProvider.id,
      name: samlAuthProvider.name,
      certificate: samlAuthProvider.certificate,
      signatureAlgorithm: samlAuthProvider.signatureAlgorithm,
      issuer: samlAuthProvider.issuer,
      entryPoint: samlAuthProvider.entryPoint,
      firstnameAttributeName: samlAuthProvider.firstnameAttributeName,
      surnameAttributeName: samlAuthProvider.surnameAttributeName,
      emailAttributeName: samlAuthProvider.emailAttributeName,
      roleAttributeName: samlAuthProvider.roleAttributeName,
      active: samlAuthProvider.active,
      defaultRoleId: samlAuthProvider.defaultRoleId,
    };

    expect(samlAuthProviderSerializer(samlAuthProvider)).toEqual(
      expectedPayload
    );
  });
});
