const { omit, omitBy, isNil, mapValues } = require('lodash')
const {
  JOIN_MAP,
  LEAVE_MAP,
  JOIN_CALL,
  LEAVE_CALL
} = require('../frontend/src/Metamaps/Realtime/events')

const NOT_IN_CONVERSATION = 0
const IN_CONVERSATION = 1

const addMapperToMap = (map, userId) => { return { ...map, [userId]: NOT_IN_CONVERSATION }}

module.exports = { reducer: (state = { connectedPeople: {}, liveMaps: {} }, action) => {
  const { type, payload } = action
  const { connectedPeople, liveMaps } = state
  const map = payload && liveMaps[payload.mapid]
  const mapWillEmpty = map && Object.keys(map).length === 1
  const callWillFinish = map && (type === LEAVE_CALL || type === 'DISCONNECT') && Object.keys(map).length === 2

  switch (type) {
  case JOIN_MAP:
    return {
      connectedPeople: {
        ...connectedPeople,
        [payload.userid]: {
          id: payload.userid,
          username: payload.username,
          avatar: payload.avatar
        }
      },
      liveMaps: {
        ...liveMaps,
        [payload.mapid]: addMapperToMap(map || {}, payload.userid) 
      } 
    }
  case LEAVE_MAP:
    return {
      connectedPeople: omit(connectedPeople, payload.userid),
      // if the map will empty, remove it from liveMaps, if the map will not empty, just remove the mapper
      liveMaps: omitBy(mapWillEmpty ? omit(liveMaps, payload.mapid) : { ...liveMaps, [payload.mapid]: omit(liveMaps[payload.mapid], payload.userid) }, isNil)
    }
  case JOIN_CALL:
    return {
      // connectedPeople stays the same
      connectedPeople,
      liveMaps: {
        // liveMaps stays the same, except for
        ...liveMaps,
        // the map in question
        [payload.mapid]: { 
          // which stays the same, except for
          ...map,
          // the user in question, which is now marked as being in a conversation
          [payload.id]: IN_CONVERSATION
        } 
      }
    }
  case LEAVE_CALL:
    return {
      // connectedPeople stays the same
      connectedPeople,
      liveMaps: {
        // liveMaps stays the same, except for
        ...liveMaps,
        // the map in question
        [payload.mapid]: callWillFinish ? mapValues(map, () => NOT_IN_CONVERSATION) : {
          // which stays the same, except for
          ...map,
          // the user in question, which is now marked as being NOT in conversation
          [payload.userid]: NOT_IN_CONVERSATION
        } 
      }
    }
  case 'DISCONNECT':
    const mapWithoutUser = omit(map, payload.userid) 
    const newMap = callWillFinish ? mapValues(mapWithoutUser, () => NOT_IN_CONVERSATION) : mapWithoutUser 
    return {
      connectedPeople: omit(connectedPeople, payload.userid),
      // if the map will empty, remove it from liveMaps, if the map will not empty, just remove the mapper
      liveMaps: omitBy(mapWillEmpty ? omit(liveMaps, payload.mapid) : 
        { ...liveMaps, [payload.mapid]: newMap  }, isNil)
    }
  default:
    return state
  }
} }
