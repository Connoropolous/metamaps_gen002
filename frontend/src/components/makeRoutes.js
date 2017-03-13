import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import Maps from './Maps'
import MapView from './MapView'
import TopicView from './TopicView'

function nullComponent(props) {
  return null
}

export default function makeRoutes (currentUser) {
  const homeComponent = currentUser && currentUser.id ? Maps : nullComponent
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
      <Route path="request_access" component={nullComponent} />
    </Route>
    <Route path="topics/:id" component={TopicView} />
    <Route path="login" component={nullComponent} />
    <Route path="join" component={nullComponent} />
    <Route path="request" component={nullComponent} />
    <Route path="notifications">
      <IndexRoute component={nullComponent} />
      <Route path=":id" component={nullComponent} />
    </Route>
    <Route path="users/:id/edit" component={nullComponent} />
    <Route path="metacodes">
      <IndexRoute component={nullComponent} />
      <Route path="new" component={nullComponent} />
      <Route path=":id/edit" component={nullComponent} />
    </Route>
    <Route path="metacode_sets">
      <IndexRoute component={nullComponent} />
      <Route path="new" component={nullComponent} />
      <Route path=":id/edit" component={nullComponent} />
    </Route>
  </Route>
}
