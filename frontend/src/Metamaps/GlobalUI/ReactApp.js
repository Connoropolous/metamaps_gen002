/* global $ */

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { merge } from 'lodash'

import { notifyUser } from './index.js'
import ImportDialog from './ImportDialog'
import Account from './Account'
import Active from '../Active'
import DataModel from '../DataModel'
import { ExploreMaps, ChatView, TopicCard } from '../Views'
import Filter from '../Filter'
import JIT from '../JIT'
import Realtime from '../Realtime'
import Map, { InfoBox } from '../Map'
import Topic from '../Topic'
import Visualize from '../Visualize'
import makeRoutes from '../../components/makeRoutes'
let routes

// 220 wide + 16 padding on both sides
const MAP_WIDTH = 252
const MOBILE_VIEW_BREAKPOINT = 504
const MOBILE_VIEW_PADDING = 40
const MAX_COLUMNS = 4

const ReactApp = {
  mapId: null,
  unreadNotificationsCount: 0,
  mapsWidth: 0,
  mobile: false,
  mobileTitle: '',
  mobileTitleWidth: 0,
  init: function(serverData, openLightbox) {
    const self = ReactApp
    self.unreadNotificationsCount = serverData.unreadNotificationsCount
    self.mobileTitle = serverData.mobileTitle
    self.openLightbox = openLightbox
    routes = makeRoutes(serverData.ActiveMapper)
    self.resize()
    window && window.addEventListener('resize', self.resize)
  },
  handleUpdate: function(location) {
    const self = ReactApp
    // TODO: also handle page title updates
    switch (this.state.location.pathname.split('/')[1]) {
      case '':
        if (Active.Mapper) $('#yield').hide()
        ExploreMaps.updateFromPath(this.state.location.pathname)
        self.mapId = null
        Active.Map = null
        Active.Topic = null
        break
      case 'explore':
        $('#yield').hide()
        ExploreMaps.updateFromPath(this.state.location.pathname)
        self.mapId = null
        Active.Map = null
        Active.Topic = null
        break
      case 'topics':
        $('#yield').hide()
        break
      case 'maps':
        $('#yield').hide()
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
      currentUser: Active.Mapper,
      mobile: self.mobile,
      mobileTitle: self.mobileTitle,
      mobileTitleWidth: self.mobileTitleWidth,
      mobileTitleClick: (e) => Active.Map && InfoBox.toggleBox(e),
      openInviteLightbox: () => self.openLightbox('invite'),
      toggleAccountBox: Account.toggleBox
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
      userRequested: Map.userRequested,
      requestAnswered: Map.requestAnswered,
      requestApproved: Map.requestApproved,
      onRequestAccess: Map.requestAccess,
      mapIsStarred: Map.mapIsStarred,
      endActiveMap: Map.end,
      launchNewMap: Map.launch,
      toggleMapInfoBox: InfoBox.toggleBox,
      infoBoxHtml: InfoBox.html,
      toggleFilterBox: Filter.toggleBox,
      filterBoxHtml: $('.filterBox')[0].outerHTML,
      openImportLightbox: () => ImportDialog.show(),
      forkMap: Map.fork,
      openHelpLightbox: () => self.openLightbox('cheatsheet'),
      onMapStar: Map.star,
      onMapUnstar: Map.unstar,
      onZoomExtents: event => JIT.zoomExtents(event, Visualize.mGraph.canvas),
      onZoomIn: JIT.zoomIn,
      onZoomOut: JIT.zoomOut
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
      onMapFollow: ExploreMaps.onMapFollow,
      mapsWidth: ReactApp.mapsWidth
    }
  },
  getChatProps: function() {
    const self = ReactApp
    return {
      unreadMessages: ChatView.unreadMessages,
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
  },
  resize: function() {
    const self = ReactApp
    const maps = ExploreMaps.collection
    const currentUser = Active.Mapper
    const user = maps && maps.id === 'mapper' ? ExploreMaps.mapper : null
    const numCards = (maps ? maps.length : 0) + (user || currentUser ? 1 : 0)
    const mapSpaces = Math.floor(document.body.clientWidth / MAP_WIDTH)
    const mapsWidth = document.body.clientWidth <= MOBILE_VIEW_BREAKPOINT
                        ? document.body.clientWidth - MOBILE_VIEW_PADDING
                        : Math.min(MAX_COLUMNS, Math.min(numCards, mapSpaces)) * MAP_WIDTH

    self.mapsWidth = mapsWidth
    self.mobileTitleWidth = document ? document.body.clientWidth - 70 : 0
    self.mobile = document && document.body.clientWidth <= MOBILE_VIEW_BREAKPOINT
    self.render()
  }
}

export default ReactApp
