const { generateCertificateId } = require('../../src/helpers/certificate.helpers');

describe('UT-05: Certificate ID Generation', () => {
  test('5.1 — generates ID matching TAWQ-*-YYYY-* pattern', () => {
    const id = generateCertificateId('MEU-1234');
    expect(id).toMatch(/^TAWQ-[A-Z]{3}-\d{4}-[A-Z0-9]{6}$/);
  });

  test('5.2 — generates unique IDs on consecutive calls', () => {
    const id1 = generateCertificateId('MEU');
    const id2 = generateCertificateId('MEU');
    expect(id1).not.toBe(id2);
  });

  test('5.3 — embeds current year', () => {
    const id = generateCertificateId('MEU');
    expect(id).toContain(new Date().getFullYear().toString());
  });
});
