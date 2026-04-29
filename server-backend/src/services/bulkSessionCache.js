const cache = new Map();
const TTL = 15 * 60 * 1000; // 15 minutes

function set(sessionId, data) {
  cache.set(sessionId, { data, expiresAt: Date.now() + TTL });
}

function get(sessionId) {
  const entry = cache.get(sessionId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(sessionId);
    return null;
  }
  return entry.data;
}

function remove(sessionId) {
  cache.delete(sessionId);
}

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) cache.delete(key);
  }
}, 10 * 60 * 1000);

module.exports = { set, get, remove };
