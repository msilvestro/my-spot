# You're in my spot!

If you are sharing one or more screens with multiple users (more than the number of screens), you want to make sure that the maximum capacity is never exceeded. This web app allow users to reserve their spot on Netflix for some time and make a live report of the situation always accessible.

## Start the web app

- Configure the Firebase project.
- Run the app in the development mode:
  ```bash
  yarn start
  ```
- The web browser should automatically open at [http://localhost:3000](http://localhost:3000).
- If you want to test the web app on an Android mobile device:

  - Connect the device to the computer via USB.
  - Route all traffic on device localhost to computer localhost:
    ```
    adb reverse tcp:3000 tcp:3000
    ```
  - Open your mobile browser at [http://localhost:3000](http://localhost:3000).

## Firebase project configuration

### Configure Firebase Realtime Database

- The data should be structured like this:

  ```json
  {
    "users": {
      "user1": {
        "email": "user1@gmail.com",
        "name": "User 1"
      },
      "user2": {
        "email": "user2@gmail.com",
        "emailAlt": "work@gmail.com",
        "name": "User 2"
      }
    }
  }
  ```

  with `email` or `emailAlt` containing the possible email used by the user to authenticate via Google login.

- The rules must be set like this:
  ```json
  {
    "rules": {
      "users": {
        ".read": "auth != null",
        "$id": {
          ".write": "data.child('email').val() === auth.token.email || data.child('emailAlt').val() === auth.token.email"
        }
      }
    }
  }
  ```
  so that every authenticated user can see the current situation, but each user can only modify its own watching status.

### Add Firebase config object to the web app

- Follow [this guide](https://firebase.google.com/docs/web/setup#config-object).
- Copy the config object inside the file `src/firebase/firebaseConfig.ts` replacing `var` with `export const`, like this:
  ```ts
  export const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PROJECT_ID.firebaseio.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "G-MEASUREMENT_ID",
  }
  ```

## Deploy

- Build the app:
  ```bash
  yarn build
  ```
- Test, preview, deploy on Firebase (https://firebase.google.com/docs/hosting/test-preview-deploy):
  - Create a preview version online to check that everything is alright (replace `CHANNEL_ID`):
    ```bash
    firebase hosting:channel:deploy CHANNEL_ID
    ```
  - Deploy live with a message:
    ```bash
    firebase deploy --only hosting -m "Deploying the best new feature ever."
    ```
