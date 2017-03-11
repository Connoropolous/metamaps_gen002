import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import Maps from './Maps'
import MapView from './MapView'

export default function makeRoutes () {
  return <Route path="/" component={App} >
    <IndexRoute component={Maps} />
    <Route path="explore">
      <Route path="active" component={Maps} />
      <Route path="featured" component={Maps} />
      <Route path="mine" component={Maps} />
      <Route path="shared" component={Maps} />
      <Route path="starred" component={Maps} />
      <Route path="mapper/:id" component={Maps} />
    </Route>
    <Route path="maps/:id" component={MapView} />
  </Route>
}
