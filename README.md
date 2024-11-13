# Simple Chatting Application



## Introduction

I create a Realtime Chat Application with Firebase (Authentication/Realtime Database).

First thing in mind is to create a react chat app using [https://chatengine.io](https://chatengine.io) but somehow, chatengine no longer supports new user (I could not find signup/register section on their website ?!)

So, Firebase is also a great tool as alternative to setup apps fast and easily - great to learn with!

### Key notes:

In the app, we use 3 key services of Firebase which are:

  #### 1. import { getAuth } from "firebase/auth"; 
  //use Firebase Authentication service

  ![image](https://github.com/user-attachments/assets/b9772269-65e3-4b00-aa9a-ac976ddbe338)

  #### 2. import { getFirestore } from "firebase/firestore"; 
  //use Firestore Database service (for structured data: RealTime data storage like user info/chat message..)

  Within this, MUST use onSnapshot() function for a REAL TIME listener on a specific collection (in this app, collections are: 'userchats' and 'chats')

  ![image](https://github.com/user-attachments/assets/e14761eb-a714-458c-b945-59273221966c)

  #### 3. import { getStorage } from "firebase/storage"; 
  //use Firestore Storage service (storing & serving larger files like images/videos/audio files...)

  ![image](https://github.com/user-attachments/assets/a0964a26-a262-4b39-8626-02ea5ff88a6d)

Instead of using Redux to create store (state managment), we use Zustand - a light weight and compact state management library.

We cannot directly use conditional syntax in object literal notation without the spread operator (...)

Image download function:

Error: 

Access to fetch at 'https://firebasestorage.googleapis.com/v0/b/chatting-app-f24d5.appspot.com/o/avatars%2F20241106_154734_doubtful_cow.png?alt=media&token=8aac87b6-0d0b-41f3-9bfa-c5f618d7044d' from origin 'http://localhost:3000' has been blocked by CORS policy: 

No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled

Solution: 

Firebase Storage does not allow cross-origin requests (CORS) by default

To download data directly in the browser, you must configure your Cloud Storage bucket for cross-origin access (CORS). Firstly, install gsutil from https://cloud.google.com/storage/docs/gsutil_install, then login with your gcloud credential on command line with gsutil

Create a JSON file named cors.json in root with content as below:

[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]

Run: gsutil cors set cors.json gs://<your-cloud-storage-bucket> to deploy these restrictions.

(https://firebase.google.com/docs/storage/web/download-files#cors_configuration)

### Deploy using HEROKU

1. In your pc, download and install the Heroku CLI.

2. In Heroku website, create an app named 'ryandev-chatting-app'

3. CMD => type: heroku login

4. In your IDE (mine is VScode) > Terminal > type: git push heroku main

   ![image](https://github.com/user-attachments/assets/4501d890-7d5a-4584-9801-3f76cb295793)

   ![image](https://github.com/user-attachments/assets/03f12ca4-e4c1-4c26-a0aa-eee102ff95c8)

5. Go to your app > Settings, if you have .env file, go to Config Vars > Show Config Vars > add key-value in here. Forget this step, you can not authenticate your app properly. 

   ![image](https://github.com/user-attachments/assets/02a425a3-a9b8-4810-a3a9-a68beacac133)

6. Now your app is hosted in Heroku, use Heroku Git URL to access your published app. Have fun ! 😎😁❤




