# Simple Firebase Auth API Example

This is a very simple API authentication example, using the following stack:

- Firebase hosting for the web page
- Firebase cloud functions for the API
  - functions written in Typescript
  - Express.js is used to handle the API calls
- FirebaseUI for handling the login UI
- Firebase authentication, log in with a Google account.

There are only two web pages in the example – a login page and a page that checks the login status and either links to the login page or displays the user name and fetches current timestamp from the API using the logged-in users credentials to authenticate with the API.

The API has only one endpoint that validates the caller's authentication credentials (and optionally restricts users to one domain), and returns the current timestamp.

The API is stateless, ie. the ID token must be sent with every request.

## Installation

### Firebase project

Go to the Firebase console and create a new project.

In Authentication → Sign-in method, enable Google authentication.

### Local installation

You need the Firebase tools to initialize a project. After installing, log in Firebase using the same account you created the project with.

```shell
npm install -g firebase-tools
firebase login
```

You can download this repository or initialize it yourself and just copy over the parts you want to use.

#### Install From Scratch

```shell
firebase init
```

- select used features
  - functions
  - hosting
- choose the Firebase project you created as default
- functions setup
  - use TypeScript
  - use TSLint
  - install dependencies
- hosting setup
  - configure as single-page app

Install the Express server

```shell
npm install express
npm install --save-dev @types/express
```

- create a hosting rewrite for API in `firebase.json`
- add scripts to `package.json`

#### Use Repository

After downloading, add the Firebase project to use to the configuration.

```shell
firebase use --add
```

#### Configuration

After creating your project directory, add the Firebase configuration for your frontend.

- go to the Firebase console → Project Overview → Add app and choose the web app
- copy the Firebase config and paste into `public/firebase.js`

## Local Dev Server

Start a local dev server:

```shell
cd functions
npm run serve
```

You can now test the login page at the “Local server” address the server gives you (default: `http://localhost:5000`).

## Deploying to Firebase

Package the application and deploy to Firebase:

```shell
npm run deploy
```

## References

- Firebase example on [authenticated JSON API](https://github.com/firebase/functions-samples/tree/master/authenticated-json-api)
- [FirebaseUI for Web](https://github.com/firebase/FirebaseUI-Web)
- FirebaseUI [demo video](https://www.youtube.com/watch?v=hb85pYZSJaI) on Firecasts
