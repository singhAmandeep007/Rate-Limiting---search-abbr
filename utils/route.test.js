let matchRoutePattern = require("./route");

describe("matchRoutePattern", () => {
  test.each([
    ["/api/health", "/api/health", true],
    ["/api/health", "/api/healthz", false],
    ["/api/*", "/api/health", true],
    ["/api/users/*/comments/*", "/api/users/121/comments/12", true],
    ["/api/users/*/comments/*", "/api/users/121/comments", false],
    ["/api/users/*/comments/*", "/api/users/121/comments/12/likes", true],
    ["/api/users/*/comments/*", "/api/users/121/comments/12/likes/1", true],
    ["/api/users/*/comments", "/api/users/121/comments/12/likes/1/2", false],
    ["/api/users/*/comments", "/api/users/121/comments", true],
    ["/api/users/*/comments", "/api/users/121/comments/12", false],
    ["*", "/api/health", true],
    ["/api/*", "/api/health/*/users/1", true],
  ])("should return %s for %s", (routePattern, reqPath, expected) => {
    expect(matchRoutePattern(routePattern, reqPath)).toBe(expected);
  });
});
