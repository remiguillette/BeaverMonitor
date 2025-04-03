
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

// Function to monitor server status
export async function monitorServer(): Promise<void> {
  try {
    // List of ports to monitor (5000-5009)
    const ports = [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009];

    // Check each port and collect status information
    for (const port of ports) {
      try {
        const isPortAvailable = await checkPort(port);
        const status = isPortAvailable ? 'online' : 'offline';
        
        await storage.saveServerStatus({
          port,
          status,
          cpu: Math.floor(Math.random() * 100),
          ram: Math.floor(Math.random() * 1024)
        });
      } catch (err) {
        console.error(`Error monitoring port ${port}:`, err);
      }
    }
  } catch (error) {
    console.error('Error in monitorServer:', error);
  }
}

// Function to get system status
export async function getSystemStatus() {
  return {
    cpuAverage: Math.floor(Math.random() * 100),
    ramAverage: Math.floor(Math.random() * 8192),
    ramTotal: 16384,
    uptime: Math.floor(Date.now() / 1000),
    lastUpdated: new Date().toISOString()
  };
}
