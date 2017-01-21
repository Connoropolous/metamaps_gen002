import _ from 'lodash'
import Backbone from 'backbone'

// make changes to Backbone before loading Metamaps code
try { Backbone.$ = window.$ } catch(err) {}
Backbone.ajax = (opts) => window.$.ajaxq('backbone-ajaxq', opts)

import Metamaps from './Metamaps'

// create global references
window._ = _
window.Metamaps = Metamaps
window.Backbone = Backbone // TODO remove
