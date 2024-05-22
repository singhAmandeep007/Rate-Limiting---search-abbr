# Rate Limited Fuzzy Search

## How to start the server ?

- `npm install`
- `npm start` or `npm run watch` (to run in watch mode)

## How to run the tests ?

- `npm test`

## Problem -

### Write an endpoint that does a fuzzy search on the names provided in the `names.json` file.

- http://localhost:8000/api/search?q=alx
- `@param q: query paramter` which is the search term
- So the conditions are - the name doesn't need to be an exact match.

  - Imagine a name - Amandeep. All these queries are valid for "Amandeep"
    - q=adp
    - q=amnp
    - q=a
    - q=AmAn
    - q=Adeep
  - Invalid entries - which shouldn't return "Amandeep"
    - q=Apman
    - q=anm
    - q=ape

- You can use regular expressions if you like (regex) but would be better if you do it the vanilla way.

### Write a middleware - `rate limiter`

- It that makes sure, the endpoint cannot be hit by a certain `IP` for more than a limit in a period of time. For example 5 times a minute. If the user (IP) exceeds the limit, return status code of `429` with a message _Limit exceeded_
- The middleware should be configurable, so that the limit and the period can be configured.
- The middle should also have blacklisting and whitelisting capabilities. So that rate limiting can toggled on certain routes.
- Blacklisting - For example if the route `"/api/*"` is blacklisted, then rate limiting should be applied on all routes starting with `/api/`.
- Whitelisting - For example if the route `"/api/search?q=am"` and `"/api/search?q=qa"` is whitelisted, then rate limiting should not be applied on these routes.
