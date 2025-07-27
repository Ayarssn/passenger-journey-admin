import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Ton backend

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connexion au serveur socket
    const socket = io(SOCKET_SERVER_URL);

    // Écouter l'événement 'notification'
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    // Nettoyage à la désinstallation du composant
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Notifications en temps réel</h2>
      {notifications.length === 0 && <p>Aucune notification</p>}
      <ul>
        {notifications.map((notif, idx) => (
          <li key={idx}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
}
