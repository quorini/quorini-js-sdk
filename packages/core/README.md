# @quorini/core

## Description
This package is used to configure a project with the backend published by [quorini.app](https://quorini.app/).\
Quorini SDK enables developers to develop Quorini Backend-powered mobile and web apps.

For more information, visit [github repository readme](https://github.com/quorini/quorini-js-sdk#quorini-sdk).

## Installing
To install this package, simply type add or install `@quorini/core` using your favorite package manager:

```ts
npm install @quorini/core

or
yarn add @quorini/core

or
pnpm add @quorini/core
```

## Getting Started
The Quorini SDK is modulized by clients and functions\
To send a request, you only need to import the QClient and the functions you need:

```tsx
// ES5 example
const { QClient, login, logout } = require("@quorini/core");
```
```tsx
// ES6+ example
import { QClient, login, logout } from "@quorini/core";
```

## Usage
```tsx
import { QClient } from "@quorini/core";

QClient.configure({
  projectId: "YOUR_PROJECT_ID", // specify your project id
  env: 'YOUR_PROJECT_ENVIRONMENT', // for example, 'production' or 'development'
  // add other optional configuration
})
```

### Async/await
We recommend using await operator to wait for the promise returned by `login` operation as follows:
```tsx
// async/await.
try {
  const session = await login(username, password);
  // process session.
} catch (error) {
  // error handling.
} finally {
  // finally.
}
```

Async-await is clean, concise, intuitive, easy to debug and has better error handling as compared to using Promise chains or callbacks.
#### Promises
You can also use Promise chaining to execute `login` operation.
```tsx
login(username, password).then(
  (response) => {
    // process response.
  },
  (error) => {
    // error handling.
  }
);
```
Promises can also be called using .catch() and .finally() as follows:
```tsx
login(username, password)
  .then((data) => {
    // process data.
  })
  .catch((error) => {
    // error handling.
  })
  .finally(() => {
    // finally.
  });
```

## **Subscriptions module (coming soon)**

```tsx
import { QStream } from "@quorini/core"

const callbackFnEvent = (obj) => { user's code }

QStream.on("event", callbackFnEvent)

QStrema.on("connect", callbackFnConnect)
QStrema.on("close", callbackFnClose)

...

QStream.subscribe("onObjectCreate", "OPTIONAL_GQL_QUERY_FILTER", "OPTIONAL_SELECTORS")
```

## **Storage (coming soon)**
- **Public file (e.g. Image)**

  ```tsx
  import { Storage } from '@quorini/core'

  export function App() {
    return <Storage.Image alt="sleepy-dog" path="public/dog.jpg" />
  }
  ```
- **Private or Protected file (e.g. Image)**

  ```tsx
  import { Storage } from '@quorini/core'

  export function App() {
    return (
      <Storage.Image
        alt="protected dog"
        path={({ identityId }) => `protected/${identityId}/dog.jpg`}
      />
    )
  }
  ```
- **Error Handling (e.g. Image)**

  ```tsx
  import { Storage } from '@quorini/core'

  export function App() {
    return (
      <Storage.Image
        alt="fallback dog"
        path="guest/dog-in-basket.jpg"
        fallbackSrc="/fallback_dog.jpg"
        onGetUrlError={(error) => console.error(error)}
      />
    )
  }
  ```

## Operations
- login
- logout
- signup
- verifyEmail
- refreshAuthToken
- sendInvitation
- acceptInvitation
- query
- mutate
