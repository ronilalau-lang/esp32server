importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCecItsQhqKLmeLAqcWTCjNc2krXozcZOQ",
  authDomain: "esp32-painel.firebaseapp.com",
  projectId: "esp32-painel",
  storageBucket: "esp32-painel.appspot.com",
 messagingSenderId: "342570842370",
  appId: "1:342570842370:web:73b122004cff88a901aa1b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon.png"
    }
  );
});