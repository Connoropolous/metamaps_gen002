import {
  INVITED_TO_CALL,
  INVITED_TO_JOIN,
  CALL_ACCEPTED,
  CALL_DENIED,
  INVITE_DENIED,
  CALL_IN_PROGRESS,
  CALL_STARTED,
  MAPPER_JOINED_CALL,
  MAPPER_LEFT_CALL,

  CHECK_FOR_CALL,
  ACCEPT_CALL,
  DENY_CALL,
  DENY_INVITE,
  INVITE_TO_JOIN,
  INVITE_A_CALL,
  JOIN_CALL,
  LEAVE_CALL
} from '../frontend/src/Metamaps/Realtime/events'

const { mapRoom, userMapRoom } = require('./rooms')

module.exports = function (io, state) {
  io.on('connection', function (socket) {

    socket.on(CHECK_FOR_CALL, function (data) {
      var callInProgress = Object.keys(io.nsps['/'].adapter.rooms[data.room] || {}).length
      if (callInProgress) socket.emit(CALL_IN_PROGRESS)
    })

    socket.on(INVITE_A_CALL, function (data) {
      socket.broadcast.in(userMapRoom(data.invited, data.mapid)).emit(INVITED_TO_CALL, data.inviter)
    })

    socket.on(INVITE_TO_JOIN, function (data) {
      socket.broadcast.in(userMapRoom(data.invited, data.mapid)).emit(INVITED_TO_JOIN, data.inviter)
    })

    socket.on(ACCEPT_CALL, function (data) {
      socket.broadcast.in(userMapRoom(data.inviter, data.mapid)).emit(CALL_ACCEPTED, data.invited)
      socket.broadcast.in(mapRoom(data.mapid)).emit(CALL_STARTED)
    })

    socket.on(DENY_CALL, function (data) {
      socket.broadcast.in(userMapRoom(data.inviter, data.mapid)).emit(CALL_DENIED, data.invited)
    })

    socket.on(DENY_INVITE, function (data) {
      socket.broadcast.in(userMapRoom(data.inviter, data.mapid)).emit(INVITE_DENIED, data.invited)
    })

    socket.on(JOIN_CALL, function (data) {
      socket.broadcast.in(mapRoom(data.mapid)).emit(MAPPER_JOINED_CALL, data.id)
    })

    socket.on(LEAVE_CALL, function (data) {
      socket.broadcast.in(mapRoom(data.mapid)).emit(MAPPER_LEFT_CALL, data.id)
    })
  })
}   

