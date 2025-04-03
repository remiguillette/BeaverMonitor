import { useAllRegionsTraffic, TrafficData } from "@/hooks/useTraffic";
import { Car, AlertCircle, Construction, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrafficPanel() {
  const { 
    "GTA Toronto": gtaTorontoTraffic, 
    "Toronto": torontoTraffic, 
    "Hamilton": hamiltonTraffic, 
    "Niagara Region": niagaraRegionTraffic, 
    isLoading, 
    isError 
  } = useAllRegionsTraffic();

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertCircle className="text-primary mr-2" />;
      case 'construction':
        return <Construction className="text-primary mr-2" />;
      case 'congestion':
        return <AlertTriangle className="text-primary mr-2" />;
      case 'info':
        return <Info className="text-primary mr-2" />;
      default:
        return <AlertTriangle className="text-primary mr-2" />;
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'border-[#ff4444]';
      case 'warning':
        return 'border-[#ffbb33]';
      case 'success':
        return 'border-[#00C851]';
      default:
        return 'border-[#ffbb33]';
    }
  };

  const renderTrafficCard = (data: TrafficData | undefined, region: string) => {
    if (isLoading) {
      return (
        <div className="bg-[#1e1e1e] mb-6 p-5 rounded-lg border border-[#333333]">
          <h3 className="text-2xl font-medium mb-4">{region}</h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div className="bg-[#1e1e1e] mb-6 p-5 rounded-lg border border-[#333333]">
          <h3 className="text-2xl font-medium mb-4">{region}</h3>
          <div className="text-red-500">Impossible de charger les données de circulation.</div>
        </div>
      );
    }

    return (
      <div className="bg-[#1e1e1e] mb-6 p-5 rounded-lg border border-[#333333]">
        <h3 className="text-2xl font-medium mb-4">{region}</h3>
        
        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 traffic-incidents">
          {data.incidents && data.incidents.length > 0 ? (
            data.incidents.map((incident, index) => (
              <div key={index} className={`border-l-4 ${getSeverityBorderColor(incident.severity)} pl-3 py-2 bg-[#252525] transition-all duration-200 hover:bg-[#2a2a2a] rounded-r`}>
                <div className="flex items-center flex-wrap">
                  {getIncidentIcon(incident.type)}
                  <span className="font-medium break-words">{incident.location}</span>
                </div>
                <p className="text-sm mt-1 break-words pl-7 text-gray-300">{incident.description}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-400">Aucun incident signalé pour cette région.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e1e] p-6 flex flex-col overflow-y-auto border border-[#333333] rounded-lg">
      <h2 className="text-3xl text-white font-bold mb-6 flex items-center">
        <Car className="text-primary mr-3" />
        Circulation
      </h2>

      {renderTrafficCard(gtaTorontoTraffic as TrafficData, "GTA Toronto")}
      {renderTrafficCard(torontoTraffic as TrafficData, "Toronto")}
      {renderTrafficCard(hamiltonTraffic as TrafficData, "Hamilton")}
      {renderTrafficCard(niagaraRegionTraffic as TrafficData, "Région de Niagara")}
    </div>
  );
}
