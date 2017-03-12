/* global $ */

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'

import { merge } from 'lodash'

import { notifyUser } from './index.js'
import Active from '../Active'
import DataModel from '../DataModel'
import { ExploreMaps, ChatView, TopicCard } from '../Views'
import Realtime from '../Realtime'
import Map, { InfoBox } from '../Map'
import Topic from '../Topic'
import makeRoutes from '../../components/makeRoutes'
let routes

const ReactApp = {
  mapId: null,
  unreadNotificationsCount: 0,
  mapIsStarred: false,
  init: function(serverData) {
    const self = ReactApp
    self.unreadNotificationsCount = serverData.unreadNotificationsCount
    self.mapIsStarred = serverData.mapIsStarred
    routes = makeRoutes()
    self.render()
  },
  handleUpdate: function(location) {
    const self = ReactApp
    // TODO: also handle page title updates
    switch (this.state.location.pathname.split('/')[1]) {
      case '':
      case 'explore':
        ExploreMaps.updateFromPath(this.state.location.pathname)
        self.mapId = null
        Active.Map = null
        Active.Topic = null
        break
      case 'topics':
        break
      case 'maps':
        self.mapId = this.state.location.pathname.split('/')[2]
        break
    }
    self.render()
    // track using google analytics here
    //window.ga && window.ga('send', 'pageview', location.pathname, {title: document.title})
  },
  render: function() {
    const self = ReactApp
    const createElement = (Component, props) => <Component {...props} {...self.getProps()}/>
    const app = <Router createElement={createElement} routes={routes} history={browserHistory} onUpdate={self.handleUpdate} />
    ReactDOM.render(app, document.getElementById('react-app'))
  },
  getProps: function() {
    const self = ReactApp
    return merge({
      unreadNotificationsCount: self.unreadNotificationsCount,
      currentUser: Active.Mapper
    },
    self.getMapProps(),
    self.getTopicProps(),
    self.getMapsProps(),
    self.getTopicCardProps(),
    self.getChatProps())
  },
  getMapProps: function() {
    const self = ReactApp
    return {
      mapId: self.mapId,
      map: Active.Map,
      mapIsStarred: self.mapIsStarred,
      endActiveMap: Map.end,
      launchNewMap: Map.launch,
      toggleMapInfoBox: InfoBox.toggleBox,
      infoBoxHtml: InfoBox.html
      // filters
    }
  },
  getTopicCardProps: function() {
    const self = ReactApp
    return {
      openTopic: TopicCard.openTopic,
      metacodeSets: TopicCard.metacodeSets,
      updateTopic: TopicCard.updateTopic,
      onTopicFollow: TopicCard.onTopicFollow,
      redrawCanvas: TopicCard.redrawCanvas
    }
  },
  getTopicProps: function() {
    const self = ReactApp
    return {
      topic: Active.Topic
    }
  },
  getMapsProps: function() {
    const self = ReactApp
    return {
      section: ExploreMaps.collection && ExploreMaps.collection.id,
      maps: ExploreMaps.collection,
      juntoState: Realtime.juntoState,
      moreToLoad: ExploreMaps.collection && ExploreMaps.collection.page !== 'loadedAll',
      user: ExploreMaps.collection && ExploreMaps.collection.id === 'mapper' ? ExploreMaps.mapper : null,
      loadMore: ExploreMaps.loadMore,
      pending: ExploreMaps.pending,
      onStar: ExploreMaps.onStar,
      onRequest: ExploreMaps.onRequest,
      onMapFollow: ExploreMaps.onMapFollow
    }
  },
  getChatProps: function() {
    const self = ReactApp
    return {
      conversationLive: ChatView.conversationLive,
      isParticipating: ChatView.isParticipating,
      onOpen: ChatView.onOpen,
      onClose: ChatView.onClose,
      leaveCall: Realtime.leaveCall,
      joinCall: Realtime.joinCall,
      inviteACall: Realtime.inviteACall,
      inviteToJoin: Realtime.inviteToJoin,
      participants: ChatView.participants ? ChatView.participants.models.map(p => p.attributes) : [],
      messages: ChatView.messages ? ChatView.messages.models.map(m => m.attributes) : [],
      videoToggleClick: ChatView.videoToggleClick,
      cursorToggleClick: ChatView.cursorToggleClick,
      soundToggleClick: ChatView.soundToggleClick,
      inputBlur: ChatView.inputBlur,
      inputFocus: ChatView.inputFocus,
      handleInputMessage: ChatView.handleInputMessage
    }
  }
}

export default ReactApp
