const { omit, omitBy, isNil, mapValues } = require('lodash')
const {
  JOIN_MAP,
  LEAVE_MAP,
  JOIN_CALL,
  LEAVE_CALL
} = require('../frontend/src/Metamaps/Realtime/events')

const NOT_IN_CONVERSATION = 0
const IN_CONVERSATION = 1

const addMapperToMap = (map, userId) => { return Object.assign({}, map, { [userId]: NOT_IN_CONVERSATION })}

const reducer = (state = { connectedPeople: {}, liveMaps: {} }, action) => {
  const { type, payload } = action
  const { connectedPeople, liveMaps } = state
  const map = payload && liveMaps[payload.mapid]
  const mapWillEmpty = map && Object.keys(map).length === 1
  const callWillFinish = map && (type === LEAVE_CALL || type === 'DISCONNECT') && Object.keys(map).length === 2

  switch (type) {
  case JOIN_MAP:
    return Object.assign({}, state, {
      connectedPeople: Object.assign({}, connectedPeople, {
        [payload.userid]: {
          id: payload.userid,
          username: payload.username,
          avatar: payload.avatar
        }
      }),
      liveMaps: Object.assign({}, liveMaps, {
        [payload.mapid]: addMapperToMap(map || {}, payload.userid)
      })
    })
  case LEAVE_MAP:
    // if the map will empty, remove it from liveMaps, if the map will not empty, just remove the mapper
    const newLiveMaps = mapWillEmpty
      ? omit(liveMaps, payload.mapid)
      : Object.assign({}, liveMaps, { [payload.mapid]: omit(map, payload.userid) })

    return {
      connectedPeople: omit(connectedPeople, payload.userid),
      liveMaps: omitBy(newLiveMaps, isNil)
    }
  case JOIN_CALL:
    // update the user (payload.id is user id) in the given map to be marked in the conversation
    return Object.assign({}, state, {
      liveMaps: Object.assign({}, liveMaps, {
        [payload.mapid]: Object.assign({}, map, {
          [payload.id]: IN_CONVERSATION
        })
      })
    })
  case LEAVE_CALL:
    const newMap = callWillFinish
      ? mapValues(map, () => NOT_IN_CONVERSATION)
      : Object.assign({}, map, { [payload.userid]: NOT_IN_CONVERSATION })

    return Object.assign({}, state, {
      liveMaps: Object.assign({}, liveMaps, { map: newMap })
    })
  case 'DISCONNECT':
    const mapWithoutUser = omit(map, payload.userid)
    const newMapWithoutUser = callWillFinish ? mapValues(mapWithoutUser, () => NOT_IN_CONVERSATION) : mapWithoutUser
    const newLiveMapsWithoutUser = mapWillEmpty ? omit(liveMaps, payload.mapid) : Object.assign({}, liveMaps, { [payload.mapid]: newMapWithoutUser })
    return {
      connectedPeople: omit(connectedPeople, payload.userid),
      liveMaps: omitBy(newLiveMapsWithoutUser, isNil)
    }
  default:
    return state
  }
}

module.exports = reducer
