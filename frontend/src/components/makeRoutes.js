import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import Maps from './Maps'
import MapView from './MapView'

function nullComponent(props) {
  return null
}

export default function makeRoutes (currentUser) {
  const homeComponent = currentUser ? Maps : nullComponent
  return <Route path="/" component={App} >
    <IndexRoute component={homeComponent} />
    <Route path="explore">
      <Route path="active" component={Maps} />
      <Route path="featured" component={Maps} />
      <Route path="mine" component={Maps} />
      <Route path="shared" component={Maps} />
      <Route path="starred" component={Maps} />
      <Route path="mapper/:id" component={Maps} />
    </Route>
    <Route path="maps/:id">
      <IndexRoute component={MapView} />
      <Route path="conversation" component={MapView} />
    </Route>
    <Route path="/login" component={nullComponent} />
    <Route path="/join" component={nullComponent} />
    <Route path="/request" component={nullComponent} />
    <Route path="/notifications" component={nullComponent} />
    <Route path="/notifications/:id" component={nullComponent} />
    <Route path="/users/:id/edit" component={nullComponent} />
    <Route path="/metacodes" component={nullComponent} />
    <Route path="/metacodes/new" component={nullComponent} />
    <Route path="/metacode_sets" component={nullComponent} />
    <Route path="/metacode_sets/new" component={nullComponent} />
  </Route>
}
