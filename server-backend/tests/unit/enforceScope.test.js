const { enforceUniversityScope } = require('../../src/middleware/enforceUniversityScope');

describe('UT-04: University Scope Enforcement Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('4.1 — MoheAdmin bypasses scope check', () => {
    req.user = { roleModel: 'MoheAdmin' };
    enforceUniversityScope(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.universityScope).toBeUndefined();
  });

  test('4.2 — uniUser scoped correctly to their university', () => {
    req.user = { roleModel: 'uniUser', profile: { university: 'uni123' } };
    req.body = { university: 'uni123' };
    enforceUniversityScope(req, res, next);
    expect(req.universityScope).toBe('uni123');
    expect(next).toHaveBeenCalled();
  });

  test('4.3 — uniUser attempts cross-university action blocked with 403', () => {
    req.user = { roleModel: 'uniUser', profile: { university: 'uni123' } };
    req.body = { university: 'other_uni_456' };
    enforceUniversityScope(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cannot perform actions for a different university' });
    expect(next).not.toHaveBeenCalled();
  });

  test('4.4 — uniUser missing university profile returns 403', () => {
    req.user = { roleModel: 'uniUser', profile: {} };
    enforceUniversityScope(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'University profile not found for user' });
  });
});
