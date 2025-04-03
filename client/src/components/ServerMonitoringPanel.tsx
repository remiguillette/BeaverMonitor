import { useServerStatus, useSystemStatus, ServerInfo, SystemStatusInfo } from "@/hooks/useServerStatus";
import { Server, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function ServerMonitoringPanel() {
  const { data: serverStatusData, isLoading: isLoadingServerStatus, isError: isServerStatusError } = useServerStatus();
  const { data: systemStatusData, isLoading: isLoadingSystemStatus, isError: isSystemStatusError } = useSystemStatus() as { data: SystemStatusInfo | undefined, isLoading: boolean, isError: boolean };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="mr-1 text-[#00C851]" />;
      case 'offline':
        return <XCircle className="mr-1 text-[#ff4444]" />;
      case 'warning':
      case 'restarting':
        return <AlertTriangle className="mr-1 text-[#ffbb33]" />;
      default:
        return <CheckCircle className="mr-1 text-[#00C851]" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'offline':
        return 'Hors ligne';
      case 'warning':
        return 'Chargé';
      case 'restarting':
        return 'Redémarrage';
      default:
        return 'En ligne';
    }
  };

  const getTextColorClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-[#00C851]';
      case 'offline':
        return 'text-[#ff4444]';
      case 'warning':
      case 'restarting':
        return 'text-[#ffbb33]';
      default:
        return 'text-[#00C851]';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days} jours, ${hours} heures, ${minutes} minutes`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `Aujourd'hui, ${hours}:${minutes}:${seconds}`;
  };

  const renderServerCard = (server: ServerInfo) => {
    const progressBarColor = 
      server.status === 'offline' 
        ? 'bg-[#ff4444]' 
        : server.cpu > 75 
          ? 'bg-[#ffbb33]' 
          : 'bg-primary';

    return (
      <div key={server.port} className="bg-[#1e1e1e] p-4 rounded-lg border border-[#333333]">
        <div className="flex items-center justify-between">
          <span className="font-medium">Port {server.port}</span>
          <span className={`flex items-center ${getTextColorClass(server.status)}`}>
            {getStatusIcon(server.status)}
            {getStatusText(server.status)}
          </span>
        </div>
      </div>
    );
  };

  const renderServerGrid = () => {
    if (isLoadingServerStatus) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (isServerStatusError || !serverStatusData || !Array.isArray(serverStatusData)) {
      return <div className="text-red-500">Impossible de charger les données des serveurs.</div>;
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {serverStatusData.map((server) => renderServerCard(server))}
      </div>
    );
  };

  const renderSystemStatus = () => {
    if (isLoadingSystemStatus) {
      return (
        <div className="bg-[#1e1e1e] mt-6 p-5 rounded-lg border border-[#333333]">
          <h3 className="text-2xl font-medium mb-4">Status du système</h3>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      );
    }

    if (isSystemStatusError || !systemStatusData) {
      return (
        <div className="bg-[#1e1e1e] mt-6 p-5 rounded-lg border border-[#333333]">
          <h3 className="text-2xl font-medium mb-4">Status du système</h3>
          <div className="text-red-500">Impossible de charger les données du système.</div>
        </div>
      );
    }

    const { cpuAverage, ramAverage, ramTotal, uptime, lastUpdated } = systemStatusData as SystemStatusInfo;
    const ramPercentage = (ramAverage / ramTotal) * 100;

    return (
      <div className="bg-[#1e1e1e] mt-4 p-4 rounded-lg border border-[#333333]">
        <h3 className="text-xl font-medium mb-2">Status du système</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Utilisation moyenne CPU</span>
            <span className="font-medium">{cpuAverage.toFixed(1)}%</span>
          </div>
          <Progress value={cpuAverage} className="h-2 bg-gray-700" />
          
          <div className="flex justify-between items-center mt-4">
            <span>Utilisation moyenne RAM</span>
            <span className="font-medium">{ramAverage}MB / {ramTotal}MB</span>
          </div>
          <Progress value={ramPercentage} className="h-2 bg-gray-700" />
          
          <div className="flex justify-between items-center mt-4">
            <span>Temps de fonctionnement</span>
            <span className="font-medium">{formatUptime(uptime)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span>Dernière mise à jour</span>
            <span className="font-medium">{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e1e] p-4 flex flex-col overflow-y-auto border border-[#333333] rounded-lg">
      <h2 className="text-2xl text-white font-bold mb-3 flex items-center">
        <Server className="text-primary mr-2" />
        Status Serveur
      </h2>

      {renderServerGrid()}
      {renderSystemStatus()}
    </div>
  );
}
