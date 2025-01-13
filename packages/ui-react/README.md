# @quorini/ui-react

## Description
This package leverages a range of functions and React hooks designed to seamlessly integrate with your React application configured using the [@quorini/core](https://www.npmjs.com/package/@quorini/core) package in conjunction with the backend services provided by [quorini.app](https://quorini.app/).

## Installing
To install this package, simply type add or install `@quorini/ui-react` using your favorite package manager:

```ts
npm install @quorini/ui-react

or
yarn add @quorini/ui-react

or
pnpm add @quorini/ui-react
```

## Getting Started


```tsx
// ES5 example
const { QAuth, QGql } = require("@quorini/ui-react");
```
```tsx
// ES6+ example
import { QAuth, QGql } from "@quorini/ui-react";
```

## Usage

For more information regarding configuration, visit [github repository readme](../../README.md)

### 1. Authenticator
Before using the `@quorini/ui-react` package, ensure that your project is configured with the `@quorini/core` package.

Additionally, all providers must wrap the root DOM of your React application, with `QAuth.Provider` being the first provider in the hierarchy.

```tsx
/* src/index.tsx */
...
import { QClient } from "@quorini/core";
import { QAuth } from "@quorini/ui-react";

QClient.configure(...)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
	  ...
    <QAuth.Provider>
      <App />
    </QAuth.Provider>
    ...
  </React.StrictMode>
)
```

`useAuth` Hook that can be used to access, modify, and update QAuth’s auth state.

```tsx
/* src/app.tsx */
...
import { useAuth } from '@quorini/ui-react'

function App() {
  const { user, logout } = useAuth()

  return (
    <div>
      <p>{user.username}</p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

```

### **Option 1: Auth page as a single React UI component**

- **Add Authenticator**\
  👉 Replace `CreateUserSignUpSchema` with actual mutation from the generated file `./quorini-mutations.ts` for the user profile creation form.\
  👉 Keep in mind that `CreateUserSignUpSchema` is only available for user groups with enabled sing-up. Change this in project configuration.

  The `QAuth.Provider` guarantees that the `useAuth` hook is available throughout your application.

  ```tsx
  // index.tsx
  ...
  import { QAuth } from '@quorini/ui-react'
  import '@quorini/ui-react/styles.css'

  import { CreateUserMetadata } from './quorini-mutations.ts'

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  )

  root.render(
    <React.StrictMode>
      ...
      <QAuth.Provider
        signUpInputType={CreateUserSignUpSchema}
        usergroup="User" /* usergroup name be assigned to usergroup. */
      >
        <App />
      </QAuth.Provider>
      ...
    </React.StrictMode>
  )
  ```

### **Option 2 (custom UI): Auth module (for custom auth components implementation)**

- **Add Auth Api endpoints**\
  You can use the api endpoints directly.
  To use them, you need to import auth APIs from core package.

  ```tsx
  // auth.tsx
  ...
  import { login, signup, sendInvitation, refreshAuthToken } from '@quorini/core'

  const Auth = () => {
    const submitLogin = () => {
      const user = await login(username, password)
    }

    render() {
      return (
        <form onSubmit={submitLogin}>
          <input placeholder="email" />
          <input placeholder="password" />
          <button type="submit"/>
        </form>
      )
    }
  }
  ```

#### Objects & Operations built-in useAuth hook
- user
- session
- login
- logout
- signup
- verifyEmail

In more detail refer to [this doc](#upcoming).

### 2. GraphQL API Handler
The `QGql.Provider` should wrap the root of the React DOM and enable the usage of its associated hook functions.

```tsx
/* src/index.tsx */
...
import { QClient } from "@quorini/core";
import { QAuth, QGql } from "@quorini/ui-react";

QClient.configure(...)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
	  ...
    <QAuth.Provider>
      <QGql.Provider>
        <App />
      </QGql.Provider>
    </QAuth.Provider>
    ...
  </React.StrictMode>
)
```

```tsx
/* src/app.tsx */
...
import { useQGql } from '@quorini/core'
import { AdminFilterInput, listAdmins, listAdminsResponse, listAdminsVars } from './src/quorini-queries'
import { createAdmin, createAdminResponse, createAdminVars } from './src/quorini-mutations'

function App() {
  const { query, mutate } = useQGql()
  
  // queries examples
  const fetchAdmins = async () => {
    try {
      const response: listAdminsResponse = await query(listAdmins)
      console.log('Fetched Admins:', response)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }
  const fetchFilterAdmins = async () => {
    try {
      const filter = {
        fullName: { eq: 'SPECIFIC_NAME' }
      } as AdminFilterInput

      const response: listAdminsResponse = await query(listAdmins, { filter })
      console.log('Fetched filterd Admins:', response)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }
  const fetchFilterAdminsWithSelector = async () => {
    try {
      const filter = {
        fullName: { eq: 'SPECIFIC_NAME' }
      } as AdminFilterInput

      const response: listAdminsResponse = await query(listAdmins, { filter }, 'email fullName')
      console.log('Fetched specific Admin with selector:', response)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // mutation example
  const createAdmin = async () => {
    try {
      const input = {
        fullName: "SPECIFIC_NAME",
        email: "EMAIL_ADDRESS"
      }
      const response: createAdminResponse = await mutate(createAdmin, { input })
      console.log("mutation response", response);
    } catch (error) {
      console.error('Error creation new admin:', error)
    }
  }

  ...
}
```

#### Operations built-in useQGql hook
- query
- mutate
- subscriber (upcoming)
