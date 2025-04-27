import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui/button";

export function RoomQRCode({ code }: { code: string }) {
  const [showQR, setShowQR] = useState(false);

  const roomUrl = `${window.location.origin}/multiplayer/room/${code}`;

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Small "Show QR" Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowQR(true)}
        className="text-xs px-3 py-1"
      >
        Show QR
      </Button>

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>

            {/* QR Code Display */}
            <QRCodeCanvas value={roomUrl} size={200} bgColor="#ffffff" fgColor="#000000" />

            <p className="mt-4 text-sm text-gray-600 text-center">
              Scan to Join Room
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
