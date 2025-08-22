import RoomHistory from "../models/RoomHistory.js";

// Record join
const recordJoin = async (userId, roomId, subject) => {
    await RoomHistory.create({
        user: userId,
        room: roomId,
        subject
    });
};

// Record leave
const recordLeave = async (userId, roomId) => {
    await RoomHistory.findOneAndUpdate(
        { user: userId, room: roomId, leftAt: null },
        { leftAt: new Date() }
    );
};

const recordDelete = async (roomId) => {
    try {
        // Set leftAt for all entries that haven't been marked as left
        await RoomHistory.updateMany(
            { room: roomId, leftAt: null },
            { leftAt: new Date() }
        );

    } catch (err) {
        console.error("Error marking room as deleted:", err);
    }
};

export default { recordJoin, recordLeave, recordDelete };