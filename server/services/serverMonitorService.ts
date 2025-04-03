import { storage } from '../storage';
import { promisify } from 'util';
import http from 'http';

// Function to check if a port is available/listening
async function checkPort(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const socket = http.get({
      hostname: 'localhost',
      port,
      path: '/',
      timeout: 1000
    })
    .on('response', () => {
      socket.destroy();
      resolve(true);
    })
    .on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

// Fonction pour récupérer le statut des ports
export async function getPortsStatus(): Promise<void> {
  try {
    // List of ports to monitor (5000-5009)
    const ports = [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009];

    // Check each port and collect status information
    for (const port of ports) {
      try {
        // Try to ping the port to see if it's up
        const isPortAvailable = await checkPort(port);

        // Afficher le statut du port
        if (isPortAvailable) {
          console.log(`Port ${port} : En ligne`);
        } else {
          console.log(`Port ${port} : Hors ligne`);
        }
      } catch (err) {
        console.error(`Error monitoring port ${port}:`, err);

        // Si il y a une erreur, considérer le port comme hors ligne
        console.log(`Port ${port} : Hors ligne`);
      }
    }
  } catch (error) {
    console.error('Error in getPortsStatus:', error);
  }
}