const request = require('supertest');
const app = require('../../src/server');
const User = require('../../src/models/users.model');
const University = require('../../src/models/universities.model');
const UniUser = require('../../src/models/uniUsers.model');
const Certificate = require('../../src/models/certificates.model');
const jwt = require('jsonwebtoken');

require('./setup');

jest.mock('../../src/services/qr.service', () => ({
  generateQRCode: jest.fn().mockResolvedValue(Buffer.from('qr-buffer')),
  embedQRInPDF: jest.fn().mockResolvedValue(Buffer.from('pdf-with-qr-buffer')),
}));

jest.mock('../../src/services/ipfs.service', () => ({
  uploadToIPFS: jest.fn().mockResolvedValue('QmTestIpfsHash123456789'),
}));

const mockBlockchainService = {
  issueCertificate: jest.fn().mockResolvedValue({ transactionID: '0xTestTxHash123456' }),
};
jest.mock('../../src/services/blockchain.service', () => mockBlockchainService);

describe('IT-02: Certificate Issuance Pipeline & Rollback', () => {
  let staffToken, universityId, staffUser;

  beforeEach(async () => {
    jest.clearAllMocks();

    const university = await University.create({
      name: 'Middle East University',
      orgId: 'MEU-1234',
      address: 'Amman, Jordan',
      contactEmail: 'info@meu.edu.jo',
      licenseNumber: 'MEU-LIC-2026'
    });
    universityId = university._id;

    const uniProfile = await UniUser.create({
      university: universityId,
      role: 'UniStaff',
      department: 'Admissions'
    });

    staffUser = await User.create({
      identifier: 'staff_1',
      name: 'Staff Member',
      roleModel: 'uniUser',
      profile: uniProfile._id
    });

    staffToken = jwt.sign({
      userId: staffUser._id,
      identifier: staffUser.identifier,
      roleModel: 'uniUser',
      subRole: 'UniStaff'
    }, process.env.JWT_SECRET);
  });

  const validPayload = {
    studentId: '20221010',
    studentPersonalId: '9988776655',
    degree: 'BSc Computer Science',
    major: 'Software Engineering',
    gpa: 3.85,
    graduationDate: '2026-01-15T00:00:00.000Z'
  };

  test('2.1 — Successful single issuance commits atomic chain and returns txHash & ipfsHash', async () => {
    const res = await request(app)
      .post('/api/certificates/issue')
      .set('Authorization', `Bearer ${staffToken}`)
      .field('studentId', validPayload.studentId)
      .field('studentPersonalId', validPayload.studentPersonalId)
      .field('degree', validPayload.degree)
      .field('major', validPayload.major)
      .field('gpa', validPayload.gpa)
      .field('graduationDate', validPayload.graduationDate)
      .attach('file', Buffer.from('dummy pdf content'), 'cert.pdf');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.certificateId).toMatch(/^TAWQ-/);
    expect(res.body.txHash).toBe('0xTestTxHash123456');
    expect(res.body.ipfsHash).toBe('QmTestIpfsHash123456789');

    const certInDb = await Certificate.findOne({ personalId: validPayload.studentPersonalId });
    expect(certInDb).toBeDefined();
    expect(certInDb.status).toBe('verified');
  });

  test('2.2 — Duplicate certificate rejected with 409', async () => {
    await Certificate.create({
      certificateId: 'TAWQ-MEU-2026-ABC123',
      university: universityId,
      studentId: validPayload.studentId,
      personalId: validPayload.studentPersonalId,
      degree: validPayload.degree,
      major: validPayload.major,
      gpa: validPayload.gpa,
      graduationDate: validPayload.graduationDate,
      ipfsHash: 'QmExisting',
      status: 'verified',
      issuedBy: staffUser._id
    });

    const res = await request(app)
      .post('/api/certificates/issue')
      .set('Authorization', `Bearer ${staffToken}`)
      .field('studentId', validPayload.studentId)
      .field('studentPersonalId', validPayload.studentPersonalId)
      .field('degree', validPayload.degree)
      .field('major', validPayload.major)
      .field('gpa', validPayload.gpa)
      .field('graduationDate', validPayload.graduationDate)
      .attach('file', Buffer.from('dummy pdf content'), 'cert.pdf');

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already issued');
  });

  test('2.4 — Blockchain failure triggers manual rollback (no orphan cert in DB)', async () => {
    mockBlockchainService.issueCertificate.mockRejectedValueOnce(new Error('Kaleido Gateway Timeout (30s)'));

    const res = await request(app)
      .post('/api/certificates/issue')
      .set('Authorization', `Bearer ${staffToken}`)
      .field('studentId', validPayload.studentId)
      .field('studentPersonalId', validPayload.studentPersonalId)
      .field('degree', validPayload.degree)
      .field('major', validPayload.major)
      .field('gpa', validPayload.gpa)
      .field('graduationDate', validPayload.graduationDate)
      .attach('file', Buffer.from('dummy pdf content'), 'cert.pdf');

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('Kaleido Gateway Timeout');

    const count = await Certificate.countDocuments({ personalId: validPayload.studentPersonalId });
    expect(count).toBe(0);
  });
});
