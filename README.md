# Simple Chatting Application



## Introduction

I create a Realtime Chat Application with Firebase (Authentication/Realtime Database).

First thing in mind is to create a react chat app using [https://chatengine.io](https://chatengine.io) but somehow, chatengine no longer supports new user (I could not find signup/register section on their website ?!)

So, Firebase is also a great tool as alternative to setup apps fast and easily - great to learn with!

### Key notes:

In the app, we use 3 key services of Firebase which are:

1/ import { getAuth } from "firebase/auth"; //use Firebase Authentication service

![image](https://github.com/user-attachments/assets/b9772269-65e3-4b00-aa9a-ac976ddbe338)

2/ import { getFirestore } from "firebase/firestore"; //use Firestore Database service (for structured data: RealTime data storage like user info/chat message..)

Within this, MUST use onSnapshot() function for a REAL TIME listener on a specific collection (in this app, collections are: 'userchats' and 'chats'

![image](https://github.com/user-attachments/assets/e14761eb-a714-458c-b945-59273221966c)

3/ import { getStorage } from "firebase/storage"; //use Firestore Storage service (storing & serving larger files like images/videos/audio files...)

![image](https://github.com/user-attachments/assets/a0964a26-a262-4b39-8626-02ea5ff88a6d)

Besides, instead of using redux to create store (state managment), we use Zustand - a light weight and compact state management library.

### Detail explanation

