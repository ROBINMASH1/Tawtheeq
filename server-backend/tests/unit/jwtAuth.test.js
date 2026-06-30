const { authMiddleware } = require('../../src/middleware/jwtAuth');
const User = require('../../src/models/users.model');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/users.model');

describe('UT-01: JWT Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('1.1 — populates req.user and calls next() with valid token', async () => {
    const mockUser = { _id: 'user123', roleModel: 'MoheAdmin' };
    const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(mockUser) }),
    });

    await authMiddleware(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  test('1.2 — returns 401 when no Authorization header', async () => {
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  test('1.3 — returns 401 for malformed token', async () => {
    req.headers.authorization = 'Bearer invalid_token_here';
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  test('1.4 — returns 401 for expired token', async () => {
    const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    req.headers.authorization = `Bearer ${token}`;
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('1.5 — returns 404 when user does not exist in DB', async () => {
    const token = jwt.sign({ userId: 'nonexistent' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(null) }),
    });
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
