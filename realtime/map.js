const {
  MAPPER_LIST_UPDATED,
  NEW_MAPPER,
  LOST_MAPPER,
  MESSAGE_CREATED,
  TOPIC_DRAGGED,
  TOPIC_CREATED,
  TOPIC_REMOVED,
  SYNAPSE_CREATED,
  SYNAPSE_REMOVED,
  PEER_COORDS_UPDATED,

  JOIN_MAP,
  LEAVE_MAP,
  SEND_COORDS,
  SEND_MAPPER_INFO,
  CREATE_MESSAGE,
  DRAG_TOPIC,
  CREATE_TOPIC,
  REMOVE_TOPIC,
  CREATE_SYNAPSE,
  REMOVE_SYNAPSE
} = require('../frontend/src/Metamaps/Realtime/events')

const { mapRoom, userMapRoom } = require('./rooms')

module.exports = function(io, store) {
  io.on('connection', function(socket) {
    // this will ping everyone on a map that there's a person just joined the map
    socket.on(JOIN_MAP, function(data) {
      socket.mapid = data.mapid
      socket.userid = data.userid
      socket.username = data.username
      socket.avatar = data.avatar
      var newUser = {
        userid: data.userid,
        username: data.username,
        avatar: data.avatar
      }
      socket.join(mapRoom(data.mapid))
      socket.join(userMapRoom(data.userid, data.mapid))
      socket.broadcast.in(mapRoom(data.mapid)).emit(NEW_MAPPER, newUser)
    })

    const leaveMap = () => {
      var data = {
        username: socket.username,
        userid: socket.userid
      }
      socket.leave(mapRoom(socket.mapid))
      socket.leave(userMapRoom(socket.userid, socket.mapid))
      socket.broadcast.in(mapRoom(socket.mapid)).emit(LOST_MAPPER, data)
      socket.mapid = null
    }
    socket.on(LEAVE_MAP, leaveMap)
    socket.on('disconnect', leaveMap)

    // this will ping a new person with awareness of who's already on the map
    socket.on(SEND_MAPPER_INFO, function(data) {
      var existingUser = {
        userid: data.userid,
        username: data.username,
        userinconversation: data.userinconversation,
        avatar: data.avatar
      }
      socket.broadcast.in(userMapRoom(data.userToNotify, data.mapid)).emit(MAPPER_LIST_UPDATED, existingUser)
    })

    socket.on(SEND_COORDS, function(data) {
      var peer = {
        userid: data.userid,
        usercoords: data.usercoords
      }
      socket.broadcast.in(mapRoom(data.mapid)).emit(PEER_COORDS_UPDATED, peer)
    })

    socket.on(CREATE_MESSAGE, function(data) {
      var mapId = data.mapid
      delete data.mapid
      socket.broadcast.in(mapRoom(mapId)).emit(MESSAGE_CREATED, data)
    })

    socket.on(DRAG_TOPIC, function(data) {
      var mapId = data.mapid
      delete data.mapid
      socket.broadcast.in(mapRoom(mapId)).emit(TOPIC_DRAGGED, data)
    })

    socket.on(CREATE_TOPIC, function(data) {
      var mapId = data.mapid
      delete data.mapid
      socket.broadcast.in(mapRoom(mapId)).emit(TOPIC_CREATED, data)
    })

    socket.on(REMOVE_TOPIC, function(data) {
      var mapId = data.mapid
      delete data.mapid
      socket.broadcast.in(mapRoom(mapId)).emit(TOPIC_REMOVED, data)
    })

    socket.on(CREATE_SYNAPSE, function(data) {
      var mapId = data.mapid
      delete data.mapid
      socket.broadcast.in(mapRoom(mapId)).emit(SYNAPSE_CREATED, data)
    })

    socket.on(REMOVE_SYNAPSE, function(data) {
      var mapId = data.mapid
      delete data.mapid
      socket.broadcast.in(mapRoom(mapId)).emit(SYNAPSE_REMOVED, data)
    })
  })
}
