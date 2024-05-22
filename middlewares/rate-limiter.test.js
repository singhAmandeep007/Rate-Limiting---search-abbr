let rateLimiter = require("./rate-limiter");

describe("Rate Limiter Middleware", () => {
  let req, res, next;
  let originalDateNow;

  beforeEach(() => {
    originalDateNow = Date.now;
    req = { url: "/api/test", ip: "127.0.0.1" };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    Date.now = originalDateNow;

    jest.useRealTimers();
  });

  it("should return a 429 status code if the request path is blacklisted", () => {
    let middleware = rateLimiter({
      blackListedRoutes: ["/api/test"],
      maxRequests: 1,
    });

    middleware(req, res, next);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      message: expect.any(String),
    });
  });
});
