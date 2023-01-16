# Rouper Navigation

Rouper Navigation is an intermediate component for `react-router-dom`, focused on route permissions and with some other cool features.

:information_desk_person: The meaning of rouper is:

- "rou" comes from router
- "per" comes from permission

🧠💥🤯

## Installation

```shell
$ npm install rouper-navigation
```

or

```shell
$ yarn add rouper-navigation
```

## How to use

### RouperClient

To use the rouper, it is necessary to create a client class, which is responsible for the core of the lib.

```ts
import { RouperClient } from 'rouper-navigation';

const rouperClient = new RouperClient();
```

With the client instantiated, you can now import the `RouperProvider` and pass it through the component's prop.

```ts
import { RouperClient, RouperProvider } from 'rouper-navigation';

const rouperClient = new RouperClient();

const App = () => {
  return <RouperProvider client={rouperClient}>...</RouperProvider>;
};
```

#### RouperClient - arguments

At the moment, you can pass 2 configuration props (optional), they are:

- **storage**: `default: window.localStorage` Customized storage.
- **storageKeyClaims**: `default: 'ROUPER_NAVIGATION/claims'` Key to save and retrieve the `claims` information of the user who is viewing the platform. These 'claims' are used to handle who can view certain routes, as we'll see in the next sections.

```ts
const rouperClient = new RouperClient({
  storage: window.localStorage,
  storageKeyClaims: 'MY_STORAGE_KEY',
});
```

### Hooks

The hooks are the grace of this lib, with them you can create applications with dynamism linked to your routes. Remembering that Rouper is just a middler, the `react-router-dom` continues to work and run as it should.

#### - useWithRouter

This is the hook that makes the magic happen, it is responsible for receiving the customized routes and forwarding them in a standardized way to the `createBrowserRouter` function of the `react-router-dom` lib.

> :exclamation: **Note**
> Route settings must be done one level below the **RouperProvider** configuration component, for hooks to work properly.

```ts
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useWithRouter } from 'rouper-navigation';

const RouterSetting = () => {
  const router = createBrowserRouter(
    useWithRouter([{ path: '/', element: <div>Hello!</div> }])
  );

  return <RouterProvider router={router} />;
};
```

Okay, I know what you're thinking, what's the difference between me doing this, or passing the router configuration directly without the hook?

_That's where the cat's jump is_, this hook in addition to all the properties that you can pass in the route settings in the conventional way, you have a few more new props, they are:

- **paths**: `string[]`, passing this prop, you can transform the object of your route into 2, 3, any... preventing you from creating identical objects that only change the path :wink:

```ts
useWithRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        paths: ['profile', ':userId'],
        element: <UserProfilePage />,
      },
    ],
  },
]);

// expected return

[
  {
    path: '/',
    element: { $$typeof: Symbol(react.element), ... },
    children: [
      {
        path: 'profile',
        element: { $$typeof: Symbol(react.element), ... },
      },
      {
        path: ':userId',
        element: { $$typeof: Symbol(react.element), ... },
      },
    ],
  },
]
```

> :warning: **Caution**
> It is not recommended to use paths at the layout level, as all subsequent child routes will be cloned.

- **claims**: `string[]` here you pass what permissions are needed to be able to view this route :lock:.

So that claim validation does not occur after screen rendering, a validator is passed inside the `loader` prop, a method that is executed before screen rendering.

If you observe, the object generated in the return of `useWithRouter`, a loader prop is added, but don't worry, if you pass this prop in the object, it will be executed normally without any interference, unless the user doesn't have permission to view the route, in this case its function is not executed.

To better understand the `loader` prop [see the official documentation](https://reactrouter.com/en/main/route/loader)

```ts
useWithRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <SignInPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
        claims: ['DASHBOARD_VIEWER', 'ADMINISTRATOR'],
        hasSomeClaims: true,
      },
    ],
  },
]);
```

Example of a `useWithRouter` hook return object with the `claims` prop.

```ts
useWithRouter([
  ...
  {
    path: '/dashboard',
    element: <DashboardPage />,
    claims: ['DASHBOARD_VIEWER', 'ADMINISTRATOR'],
    hasSomeClaims: true,
  },
  ...
]);


// expected return

[
  {
    path: '/dashboard',
    element: { $$typeof: Symbol(react.element), ... },
    loader: ƒ (args),
  }
]

```

If the current user does not have access, an exception with status code 401 will be thrown, if you have not configured an **errorElement** a default `react-router-dom` screen will be displayed, remember to configure a nice one for the user :wink:

see how to set up an error screen with the **errorElement** prop in the [react-router-dom documentation](https://reactrouter.com/en/main/route/error-element).

- **hasSomeClaims**: `true | undefined` By default, when you pass a claims prop, you are saying that the user needs to have all the claims informed to have access to the route, however it is possible to pass a `hasSomeClaims` (as shown in the example above), when you want the user to has at least 1 of the informed claims.

- **outhers**: `Record<string, any>` You can pass extra props to your route if you want to configure breadcrumb for example. you can access this information with the `useRouperRoutes` or `useRouperMatch` hooks.

#### useRouperClaimsState

This hook manages the global state of the user's claims, so that the validation of access to the routes is carried out.

```ts
import { useRouperClaimsState } from 'rouper-navigation';

...

const [claims, setClaims] = useRouperClaimsState();

async function signIn(values) {
  try {
    const result = await loginService(values);

    setClaims(result.claims);

    ...

  } catch (error) {
    ...
  }
}

...
```

#### useRouperClient

With this hook you can access the created instance of the `RouperClient` class.

```ts
import { useRouperClient } from 'rouper-navigation';

...

const rouperClient = useRouperClient();

rouperClient.getClaims();
rouperClient.getRoutes();
rouperClient.getStorage();
rouperClient.getStorageKey();
rouperClient.setClaims(['ADMINISTRATOR']);
rouperClient.setRoutes([
  ...
  {
    path: '/dashboard',
    element: <DashboardPage />,
    claims: ['ADMINISTRATOR'],
  },
]);
rouperClient.setStorage(window.localStorage);
rouperClient.setStorageKey('MY_NEW_STORAGE_KEY');
...
```

#### useRouperRoutes

This hook lists the entire collection of routes created in the `useWithRouter` configuration.

```ts
import { useRouperRoutes } from 'rouper-navigation';

...

const routes = useRouperRoutes();

...
```

#### useRouperMatch (beta)

This hook returns the current route object, referring to the configuration in the `useWithRouter` hook.

```ts
import { useRouperMatch } from 'rouper-navigation';

...

const route = useRouperMatch();

...
```

> :eyes: **See well...**
> It is possible that it is still not working properly. :sweat_smile:

## Among other things...

For information about route nesting, loader, and other things mentioned here, but which are related to lib `react-router-dom` [visit the official documentation](https://reactrouter.com/en/main/start/overview).
