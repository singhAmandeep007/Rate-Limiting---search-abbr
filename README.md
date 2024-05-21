# Problem -

## Write an endpoint that does a fuzzy search on the names provided in the `names.json` file.

- http://localhost:3000/api/search?q=alx
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
- Write a middleware - `rateLimit` that makes sure, the endpoint cannot be hit by a certain `IP` for more than 5 times in a minute. If the user (IP) exceeds the limit, return status code of `429` with a message "Limit exceeded"
