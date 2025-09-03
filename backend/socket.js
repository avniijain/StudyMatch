import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Room from './models/Room.js';

let activeUsers = new Map();
let activeRooms = new Map();

const updateSuggestedRoomsForAll = (io) => {
    io.sockets.sockets.forEach((s) => {
        if (s.user?.id) {
            const userId = s.user.id;

            // Convert activeRooms Map to an array
            const allRooms = Array.from(activeRooms.entries()).map(([roomId, room]) => ({
                roomId,
                ...room
            }));

            // Filter rooms based on subjects & exclude ones the user is host or participant in
            const suggestedRooms = allRooms.filter((room) => {
                const subjectMatch = room.subjects?.some((subj) =>
                    (s.user.subjects || []).some(userSubj =>
                        userSubj?.toLowerCase() === subj?.toLowerCase()
                    )
                );

                const isHost = room.host?.toString() === userId.toString();
                const isParticipant = room.participants?.some((p) => p.toString() === userId.toString());

                return subjectMatch && !isHost && !isParticipant;
            });

            // Emit only to this socket
            io.to(s.id).emit('match_list_update', suggestedRooms);
        }
    });
};


export const initSocket = async (server) => {
    const io = new Server(server, {
        cors: {
            origin:  process.env.NETLIFY_URL,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next();
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = user;
        } catch (err) {
            console.log('Invalid token for socket:', err.message);
        }
        next();
    });

    const roomsFromDb = await Room.find({ status: 'active' });
    roomsFromDb.forEach(room => {
        activeRooms.set(room._id.toString(), {
            host: room.host,
            participants: room.participants,
            subject: room.subject,
            type: room.type,
            roomName: room.roomName,
            meetLink: room.meetLink
        });
    });


    io.on('connection', (socket) => {
        if (socket.user?.id) {
            const userId = socket.user.id;
            socket.join(userId.toString()); // join a room named after user ID
            activeUsers.set(userId, socket.id); // optional: track active sockets
        }

        socket.on('disconnect', () => {
            if (socket.user?.id) {
                activeUsers.delete(socket.user.id);
            }
        });

        // When user joins a room
        socket.on('join_room', ({ roomId }) => {
            if (!activeRooms.has(roomId)) {
                socket.emit('error', { message: 'Room does not exist' });
                return;
            }

            socket.join(roomId);
            io.emit('room_list_update', Array.from(activeRooms.values()));
            updateSuggestedRoomsForAll(io);
            console.log(activeRooms);
        });

        // When user leaves a room
        socket.on('leave_room', ({ roomId }) => {
            socket.leave(roomId);
            const room = activeRooms.get(roomId);
            if (room && io.sockets.adapter.rooms.get(roomId)?.size === 0) {
                activeRooms.delete(roomId);
                io.emit('room_list_update', Array.from(activeRooms.values()));
            }

            updateSuggestedRoomsForAll(io);
            console.log(activeRooms);
        });

        socket.on('room_deleted', ({ roomId }) => {
            activeRooms.delete(roomId);
            io.to(roomId).emit("room_closed", { message: "Host has closed the room" });
            io.emit('room_list_update', Array.from(activeRooms.values()));

            updateSuggestedRoomsForAll(io);
        });

        // Chat
        socket.on('chat_message', ({ roomId, userId, message }) => {
            io.to(roomId).emit('chat_message', { userId, message, timestamp: Date.now() });
        });

        socket.on('mark_notification_read', ({ senderId, notificationId }) => {
            io.to(senderId.toString()).emit('notification:read', { notificationId });
        });


    });

    return io;
}

export { activeRooms, updateSuggestedRoomsForAll };