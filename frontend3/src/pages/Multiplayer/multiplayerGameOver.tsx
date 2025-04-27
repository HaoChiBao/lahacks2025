import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const MultiplayerGameOver: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const winnerId = searchParams.get('winnerId');
    const winnerName = searchParams.get('winnerName');
    const winnerScore = searchParams.get('winnerScore');
    const questionsAnswered = searchParams.get('questionsAnswered');
    const totalQuestions = searchParams.get('totalQuestions');
    const gameMode = searchParams.get('gameMode');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    const currentUserId = searchParams.get('currentUserId');
    const roomId = searchParams.get('room_id');

    const isCurrentUserWinner = currentUserId === winnerId;

    const handlePlayAgain = () => {
        navigate(`/multiplayer/room/${roomId}?winnerId=${winnerId}&winnerName=${winnerName}&winnerScore=${winnerScore}&questionsAnswered=${questionsAnswered}&totalQuestions=${totalQuestions}&gameMode=${gameMode}&language=${language}&difficulty=${difficulty}&currentUserId=${currentUserId}&room_id=${roomId}`);
    };

    return (
        <div className="space-y-8 p-6 md:p-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <Card className="p-8 space-y-6 text-center shadow-lg rounded-3xl bg-white/80 backdrop-blur-md">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    Game Over
                </h1>
                {isCurrentUserWinner ? (
                    <h2 className="text-2xl font-semibold text-green-600">
                        🎉 Congratulations, {winnerName}! You won!
                    </h2>
                ) : (
                    <h2 className="text-2xl font-semibold text-red-600">
                        Better luck next time! {winnerName} won this time.
                    </h2>
                )}
            </Card>

            <Card className="p-8 space-y-6 shadow-lg rounded-3xl bg-white/80 backdrop-blur-md">
                <h3 className="text-xl font-semibold text-gray-800 tracking-tight">
                    Game Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Badge className="bg-blue-50 text-blue-700 rounded-full px-4 py-2 shadow-sm">
                        Winner ID: {winnerId}
                    </Badge>
                    <Badge className="bg-green-50 text-green-700 rounded-full px-4 py-2 shadow-sm">
                        Score: {winnerScore}
                    </Badge>
                    <Badge className="bg-yellow-50 text-yellow-700 rounded-full px-4 py-2 shadow-sm">
                        Questions Answered: {questionsAnswered} / {totalQuestions}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-700 rounded-full px-4 py-2 shadow-sm">
                        Game Mode: {gameMode}
                    </Badge>
                    <Badge className="bg-purple-50 text-purple-700 rounded-full px-4 py-2 shadow-sm">
                        Language: {language}
                    </Badge>
                    <Badge className="bg-red-50 text-red-700 rounded-full px-4 py-2 shadow-sm">
                        Difficulty: {difficulty}
                    </Badge>
                </div>
            </Card>

            <div className="space-y-4">
                <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                    onClick={() => window.location.href = '/'}
                >
                    Return to Home
                </Button>
                <Button
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                    onClick={handlePlayAgain}
                >
                    Play Again
                </Button>
            </div>
        </div>
    );
};

export default MultiplayerGameOver;