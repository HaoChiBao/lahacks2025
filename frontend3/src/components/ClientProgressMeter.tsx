import { Card } from "./ui/card";

interface ClientState {
    name: string;
    ready: boolean;
    questionsAnswered: number; // Number of questions answered
    choices?: {
      gameMode?: string;
      language?: string;
      difficulty?: string;
    };
    score: number; // Add score property
}

interface ClientProgressMeterProps {
  clients: { [clientId: string]: ClientState };
  totalQuestions: number;
}

export default function ClientProgressMeter({ clients, totalQuestions }: ClientProgressMeterProps) {
    return (
        <div className="space-y-4">
            {Object.entries(clients).map(([clientId, clientData]) => {
                const progress = Math.min(clientData.questionsAnswered / totalQuestions, 1);
                return (
                    <Card key={clientId} className="p-0 bg-transparent border-none shadow-none">
                        <div className="text-sm font-semibold text-gray-700 truncate transform translate-y-4">
                            Player {clientId.slice(-4)} {/* Show last 4 characters to anonymize */}
                        </div>
                        <div className="relative w-full h-2 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-blue-500 rounded transition-all"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
