# Getting Started with Quorini SDK

[Quorini core package](https://www.npmjs.com/package/@quorini/core)\
[Quorini ui-reack package](https://www.npmjs.com/package/@quorini/ui-react)

## Installation

```
npm install @quorini/core
npm install @quorini/ui-react
```

## Configuration of SDK

1. Go to [quorini.app](http://quorini.app) **"Live API"**.
2. Navigate to **"Tech Docs"** tab.
3. Copy types, queries and mutations and place in you codebase/repository.\
  3.1. `./src/quorini-types.d.ts`\
  3.2. `./src/quorini-queries.ts`\
  3.3. `./src/quorini-mutations.ts`
4. Inside `index.tsx` globally configure you SDK integration.\
  4.1. `projectId` can be copied from URL path of **"Live API"**.\
  4.2. `env` (optional) can be **"production"** or **"development"**. By default, it’s **"production"**.\
  4.3. `qglPaths` (optional) and values are from step 3.

    ```tsx
    // index.tsx
    ...
    import { QClient } from "@quorini/core"
    import * as queries from './src/quorini-queries'
    import * as mutations from './src/quorini-mutations'

    QClient.configure({
        projectId: "YOUR_PROJECT_ID",
        env: "YOUR_PROJECT_ENV",
        gqlPaths: {
            queries,
            mutations,
        },
    })

    ...
    ```

## Authentication
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
- **Add useAuth Hook**\
  React Hook that can be used to access, modify, and update `QAuth`’s auth state.
  To use them, you need to render the `QAuth` after wrapping our application with `<QAuth.Provider>`

  Then, you can use `useAuth` on your App:
  ```tsx
  // app.tsx
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
      return <form onSubmit={submitLogin}>
        <input placeholder="email" />
        <input placeholder="password" />
        <button type="submit"/>
      </form>
    }
  }
  ```

## **GraphQL API**

- **Add use QGql hook**

  ```tsx
  // index.tsx
  ...
  import { QGql } from '@quorini/ui-react'

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  )

  root.render(
    <React.StrictMode>
        ...
        <QGql.Provider>
          <App />
        </QGql.Provider>
        ...
    </React.StrictMode>
  )
  ```

  ```tsx
  // app.tsx
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
          fullName: { eq: 'SPECIFIC NAME' }
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
          fullName: { eq: 'SPECIFIC NAME' }
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
          fullName: "SPECIFIC NAME",
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
