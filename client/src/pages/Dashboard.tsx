import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import AlertBanner from '@/components/AlertBanner';
import WeatherPanel from '@/components/WeatherPanel';
import TrafficPanel from '@/components/TrafficPanel';
import ServerMonitoringPanel from '@/components/ServerMonitoringPanel';
import { useWeatherAlerts } from '@/hooks/useWeatherAlerts';

export default function Dashboard() {
  const { currentAlert, showAlert, closeAlert } = useWeatherAlerts();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentAlert && (
        <AlertBanner
          type={currentAlert.type}
          message={currentAlert.message}
          isVisible={showAlert}
          onClose={closeAlert}
        />
      )}
      
      <Header />
      
      <main className="px-8 py-4 grid grid-cols-3 gap-8" style={{ height: 'calc(100vh - 8rem)' }}>
        <WeatherPanel />
        <TrafficPanel />
        <ServerMonitoringPanel />
      </main>
    </div>
  );
}
