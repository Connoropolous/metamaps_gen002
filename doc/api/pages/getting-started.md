[Skip ahead to the endpoints.](#endpoints)

There are three ways to log in: cookie-based authentication, token-based authentication, or OAuth 2.

### 1. Cookie-based authentication

One way to access the API is through your browser. Log into metamaps.cc normally, then browse manually to https://metamaps.cc/api/v2/user/current. You should see a JSON description of your own user object in the database. You can browse any GET endpoint by simply going to that URL and appending query parameters in the URI.

To run a POST or DELETE request, you can use the Fetch API. See the example in the next section.

### 2. Token-based authentication

If you are logged into the API via another means, you can create a token. Once you have this token, you can append it to a request. For example, opening a private window in your browser and browsing to `https://metamaps.cc/api/v2/user/current?token=...token here...` would show you your current user, even without logging in by another means.

To get a list of your current tokens, you can log in using cookie-based authentication and run the following fetch request in your browser console (assuming the current tab is on some page within the `metamaps.cc` website.

```
fetch('/api/v2/tokens', {
  method: 'GET',
  credentials: 'same-origin' // needed to use the cookie-based auth
}).then(response => {
  return response.json()
}).then(console.log).catch(console.error)
```

If this is your first time accessing the API, this list wil be empty. You can create a token using a similar method:

```
fetch('/api/v2/tokens', {
  method: 'POST',
  credentials: 'same-origin'
}).then(response => {
  return response.json()
}).then(payload => {
  console.log(payload)
}).catch(console.error)
```

`payload.data.token` will contain a string which you can use to append to requests to access the API from anywhere.

### 3. OAuth 2 Authentication

TODO
