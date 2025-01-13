# Quorini SDK
<h3>This is JS SDK to integrate your Quorini project with web app.</h3>

[![Design and run serverless cloud API](https://github.com/user-attachments/assets/d446a409-e5e9-47d1-aeaf-169f24ec5eec)](https://quorini.com/)
<h4 align="center">Define your data model visually, and deploy a fully-managed serverless backend in minutes.</h4>

<h5>Visit <a href="quorini.com">quorini.com</a> for more details.</h5>
<h5>Visit <a href="quorini.com">quorini.app</a> to start building new project.</h5>

[![Product of the day at ProductHunt](https://github.com/user-attachments/assets/1c07c569-ba3d-46fe-adb7-c8133a339409)](https://www.producthunt.com/products/quorini#quorini)

[![Test project with Live API](https://cdn.prod.website-files.com/669c3258841cd988fbcc2ed2/67281d081ffa915bbb7370d8_mutationcreate2-ezgif.com-video-to-gif-converter.gif)](https://quorini.app/)

---

# Getting Started

For more detail about packages

[npm package @quorini/core](https://www.npmjs.com/package/@quorini/core) – is used to configure a project with the backend published by quorini.app. Quorini SDK enables developers to develop Quorini Backend-powered mobile and web apps.

[README.md](/packages/core/README.md)


[npm package @quorini/ui-react](https://www.npmjs.com/package/@quorini/ui-react) – leverages a range of functions and React hooks designed to seamlessly integrate with your React application configured using the `@quorini/core` package in conjunction with the backend services provided by [quorini.app](quorini.app)

[README.md](/packages/ui-react/README.md)

## Installation

```ts
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
