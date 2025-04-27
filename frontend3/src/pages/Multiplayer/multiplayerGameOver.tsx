import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const MultiplayerGameOver: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const winnerId = searchParams.get('winnerId');
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
        navigate(`/multiplayer/room/${roomId}`);
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center ${
                isCurrentUserWinner ? 'bg-green-500' : 'bg-red-500'
            }`}
        >
            <div className="w-full max-w-3xl p-6 space-y-6 bg-white rounded-2xl shadow-lg mx-4">
                <Card className="p-6 text-center shadow-md rounded-2xl">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Game Over
                    </h1>
                    {isCurrentUserWinner ? (
                        <h2 className="text-lg font-medium text-gray-700">
                            🎉 Congratulations! You won!
                        </h2>
                    ) : (
                        <h2 className="text-lg font-medium text-gray-700">
                            wow, guest-{winnerId} won this time.
                        </h2>
                    )}
                </Card>

                <Card className="p-6 shadow-md rounded-2xl">
                    <h3 className="text-lg font-medium text-gray-900 text-center">
                        Game Summary
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Badge className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-center">
                            Winner ID: {winnerId}
                        </Badge>
                        <Badge className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-center">
                            Score: {winnerScore}
                        </Badge>
                        <Badge className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-center">
                            Questions Answered: {questionsAnswered} / {totalQuestions}
                        </Badge>
                        <Badge className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-center">
                            Game Mode: {gameMode}
                        </Badge>
                        <Badge className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-center">
                            Language: {language}
                        </Badge>
                        <Badge className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-center">
                            Difficulty: {difficulty}
                        </Badge>
                    </div>
                </Card>

                <div className="space-y-4">
                    <Button
                        className="w-full bg-gray-900 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                        onClick={() => window.location.href = '/'}
                    >
                        Return to Home
                    </Button>
                    <Button
                        className="w-full bg-gray-800 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                        onClick={handlePlayAgain}
                    >
                        Play Again
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MultiplayerGameOver;