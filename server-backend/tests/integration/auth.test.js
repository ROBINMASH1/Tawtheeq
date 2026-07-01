const request = require('supertest');
const app = require('../../src/server');
const User = require('../../src/models/users.model');
const bcrypt = require('bcrypt');

const MoheAdmin = require('../../src/models/moheAdmins.model');

require('./setup');

describe('IT-01: Authentication Flow', () => {
  let testUser;
  const password = 'CorrectPassword123';

  beforeEach(async () => {
    const passwordHash = await bcrypt.hash(password, 10);
    const adminProfile = await MoheAdmin.create({ EmployeeID: 'EMP_12345' });
    testUser = await User.create({
      identifier: 'admin_test',
      name: 'Admin User',
      roleModel: 'MoheAdmin',
      profile: adminProfile._id,
      passwordHash,
      failedLoginAttempts: 0,
      isLocked: false
    });
  });

  test('1.1 — Successful login returns JWT and resets failed attempts', async () => {
    testUser.failedLoginAttempts = 2;
    await testUser.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'admin_test', password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser.failedLoginAttempts).toBe(0);
  });

  test('1.2 — Failed login increments counter', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'admin_test', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser.failedLoginAttempts).toBe(1);
  });

  test('1.3 — Account locks after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'admin_test', password: 'WrongPassword' });
    }

    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'admin_test', password });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Account is locked');

    const lockedUser = await User.findById(testUser._id);
    expect(lockedUser.isLocked).toBe(true);
  });
});
