import { Card } from "./ui/card";

interface ClientProgressMeterProps {
  clients: { [clientId: string]: { score: number } };
  totalQuestions: number;
}

export default function ClientProgressMeter({ clients, totalQuestions }: ClientProgressMeterProps) {
  return (
    <div className="space-y-4">
      {Object.entries(clients).map(([clientId, clientData]) => {
        const progress = Math.min(clientData.score / (totalQuestions * 10), 1);
        return (
          <Card key={clientId} className="p-4 bg-white shadow-md rounded-2xl">
            <div className="mb-2 text-sm font-semibold text-gray-700 truncate">
              Player {clientId.slice(-4)} {/* Show last 4 characters to anonymize */}
            </div>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              {(progress * 100).toFixed(0)}%
            </div>
          </Card>
        );
      })}
    </div>
  );
}
