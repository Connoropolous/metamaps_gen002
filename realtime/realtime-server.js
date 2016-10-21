var
io = require('socket.io')(),
signalling = require('./signal'),
junto = require('./junto'), 
map = require('./map'),
global = require('./global'),
stunservers = [{"url": "stun:stun.l.google.com:19302"}]

import { createStore } from 'redux'
import { reducer } from './reducer'

let store = createStore(reducer)

global(io, store)
signalling(io, stunservers, store)
junto(io, store)
map(io, store)
io.listen(5001)

