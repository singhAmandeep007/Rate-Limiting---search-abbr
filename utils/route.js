/**
 * Matches a route pattern with a request path.
 *
 * @param {string} routePattern - The route pattern to match.
 * @param {string} reqPath - The request path to match against the route pattern.
 * @returns {boolean} - Returns true if the route pattern matches the request path, false otherwise.
 */
function matchRoutePattern(routePattern, reqPath) {
  // Split the route pattern and request path into segments
  const routeSegments = routePattern.split("/");
  const reqSegments = reqPath.split("/");

  // Loop through each segment
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];

    const isLastSegment = i === routeSegments.length - 1;

    // Check for wildcard segment (*)
    if (routeSegment === "*") {
      // if the last segment is a wildcard, and reqPath segment have at least one more segment
      if (isLastSegment && reqSegments[i] !== undefined) {
        return true;
      }
      // if the last segment is a wildcard, and reqPath segment have no more segments
      if (isLastSegment && reqSegments[i] === undefined) {
        return false;
      }
      continue;
    } else {
      // Check for exact match
      if (routeSegment !== reqSegments[i]) {
        return false;
      }
      // if the last segment is not a wildcard, and reqPath segment do have more segments
      if (isLastSegment && reqSegments[i + 1] !== undefined) {
        return false;
      }
    }
  }

  // All segments matched
  return true;
}

module.exports = matchRoutePattern;
