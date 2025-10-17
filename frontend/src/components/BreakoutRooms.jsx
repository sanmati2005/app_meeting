import React, { useState } from 'react';
import './BreakoutRooms.css';

const BreakoutRooms = () => {
  const [rooms, setRooms] = useState([
    { 
      id: 1, 
      name: 'Group A', 
      participants: [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Sarah Johnson' }
      ]
    },
    { 
      id: 2, 
      name: 'Group B', 
      participants: [
        { id: 3, name: 'Michael Chen' },
        { id: 4, name: 'Emma Wilson' }
      ]
    }
  ]);

  const [availableParticipants] = useState([
    { id: 5, name: 'David Brown' },
    { id: 6, name: 'Lisa Taylor' },
    { id: 7, name: 'James Wilson' }
  ]);

  const [newRoomName, setNewRoomName] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);

  const addRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = {
        id: Date.now(),
        name: newRoomName,
        participants: []
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setShowAddRoom(false);
    }
  };

  const removeRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const moveParticipant = (participantId, fromRoomId, toRoomId) => {
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.id === fromRoomId) {
          // Remove participant from source room
          return {
            ...room,
            participants: room.participants.filter(p => p.id !== participantId)
          };
        } else if (room.id === toRoomId) {
          // Add participant to target room
          const participant = rooms
            .find(r => r.id === fromRoomId)
            ?.participants.find(p => p.id === participantId);
          
          if (participant) {
            return {
              ...room,
              participants: [...room.participants, participant]
            };
          }
        }
        return room;
      });
    });
  };

  const closeAllRooms = () => {
    // In a real app, this would send a signal to close all rooms
    alert('All breakout rooms closed. Participants returned to main room.');
  };

  return (
    <div className="breakout-rooms-container">
      <div className="breakout-header">
        <h2>👥 Breakout Rooms</h2>
        <p>Divide participants into smaller discussion groups</p>
      </div>

      <div className="breakout-controls">
        <button 
          className="add-room-btn"
          onClick={() => setShowAddRoom(!showAddRoom)}
        >
          + Add Room
        </button>
        <button 
          className="close-all-btn"
          onClick={closeAllRooms}
        >
          Close All Rooms
        </button>
      </div>

      {showAddRoom && (
        <div className="add-room-form">
          <input
            type="text"
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="room-name-input"
          />
          <button 
            className="create-room-btn"
            onClick={addRoom}
          >
            Create Room
          </button>
          <button 
            className="cancel-btn"
            onClick={() => setShowAddRoom(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-header">
              <h3>{room.name}</h3>
              <button 
                className="remove-room-btn"
                onClick={() => removeRoom(room.id)}
              >
                ×
              </button>
            </div>
            <div className="room-participants">
              {room.participants.length === 0 ? (
                <div className="empty-room">
                  <p>No participants in this room</p>
                </div>
              ) : (
                room.participants.map(participant => (
                  <div key={participant.id} className="participant-item">
                    <div className="participant-info">
                      <div className="participant-avatar">
                        {participant.name.charAt(0)}
                      </div>
                      <span className="participant-name">{participant.name}</span>
                    </div>
                    <div className="move-controls">
                      <select 
                        className="move-select"
                        onChange={(e) => moveParticipant(participant.id, room.id, parseInt(e.target.value))}
                        defaultValue=""
                      >
                        <option value="" disabled>Move to...</option>
                        <option value={0}>Main Room</option>
                        {rooms
                          .filter(r => r.id !== room.id)
                          .map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="available-participants">
        <h3>Available Participants</h3>
        <div className="participants-list">
          {availableParticipants.map(participant => (
            <div key={participant.id} className="participant-item">
              <div className="participant-info">
                <div className="participant-avatar">
                  {participant.name.charAt(0)}
                </div>
                <span className="participant-name">{participant.name}</span>
              </div>
              <div className="move-controls">
                <select 
                  className="move-select"
                  onChange={(e) => moveParticipant(participant.id, 0, parseInt(e.target.value))}
                  defaultValue=""
                >
                  <option value="" disabled>Move to...</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakoutRooms;