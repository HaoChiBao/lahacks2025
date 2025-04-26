const main = async () => {
    const WSS = new WebSocket("ws://localhost:3001");

    const sendMessage = (type, payload) => {
        WSS.send(JSON.stringify({ type, payload }));
    };

    WSS.onopen = () => {
        console.log("Connected to server");
    };

    WSS.onmessage = (event) => {
        console.log("Message from server: ", event.data);
        const message = JSON.parse(event.data);
        if (message.type === "roomJoined") {
            const room_id = message.payload.room_id;
            document.getElementById('currentRoomHeader').innerText = `Room ID: ${room_id}`;
        } else if (message.type === "roomCreated") {
            const room_id = message.payload.room_id;
            document.getElementById('currentRoomHeader').innerText = `Room ID: ${room_id}`;
        } if (message.type === "roomLeft") {
            document.getElementById('currentRoomHeader').innerText = "Not in a room";
        } else if (message.type === "connected") {
            const id = message.payload.id;
            document.getElementById('userIdDisplay').innerText = `User ID: ${id}`;
        }
    };

    WSS.onclose = () => {
        console.log("Disconnected from server");
    };

    document.getElementById('sendButton').addEventListener('click', () => {
        const message = document.getElementById('messageInput').value;
        if (message) {
            sendMessage("message", { text: message });
        }
    });

    document.getElementById('createRoomButton').addEventListener('click', () => {
        sendMessage("createRoom", { name: 'test' });
    });

    document.getElementById('joinRoomButton').addEventListener('click', () => {
        const room_id = document.getElementById('roomIdInput').value;
        if (room_id) {
            sendMessage("joinRoom", { room_id });
        }
    });

    document.getElementById('leaveRoomButton').addEventListener('click', () => {
        const room_id = document.getElementById('currentRoomHeader').innerText.split(': ')[1];
        if (room_id) {
            sendMessage("leaveRoom", { room_id });
        }
    });
    document.getElementById('messageAllButton').addEventListener('click', () => {
        sendMessage("messageAll", { text: 'test' });
        
    });
}

main();