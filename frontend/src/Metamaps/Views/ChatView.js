/* global $ */

import Backbone from 'backbone'
import { Howl } from 'howler'
import Autolinker from 'autolinker'
import { clone, template as lodashTemplate } from 'lodash'
import outdent from 'outdent'
import React from 'react'
import ReactDOM from 'react-dom'
// TODO is this line good or bad
// Backbone.$ = window.$

import Active from '../Active'
import Realtime from '../Realtime'
import MapChat from '../../components/MapChat'

const linker = new Autolinker({ newWindow: true, truncate: 50, email: false, phone: false })

const ChatView = {
  isOpen: false,
  conversationLive: false,
  isParticipating: false,
  mapChat: null,
  domId: 'chat-box-wrapper',
  init: function(urls) {
    const self = ChatView
    self.sound = new Howl({
      src: urls,
      sprite: {
        joinmap: [0, 561],
        leavemap: [1000, 592],
        receivechat: [2000, 318],
        sendchat: [3000, 296],
        sessioninvite: [4000, 5393, true]
      }
    })
  },
  setNewMap: function(messages, mapper, room) {
    const self = ChatView
    self.room = room
    self.mapper = mapper
    self.messages = messages // is a backbone collection
    self.conversationLive = false
    self.isParticipating = false
    self.alertSound = true // whether to play sounds on arrival of new messages or not
    self.cursorsShowing = true
    self.videosShowing = true
    self.participants = new Backbone.Collection()
    self.render()
  },
  show: () => {
    $('#' + ChatView.domId).show()
  },
  hide: () => {
    $('#' + ChatView.domId).hide()
  },
  render: () => {
    if (!Active.Map) return    
    const self = ChatView
    self.mapChat = ReactDOM.render(React.createElement(MapChat, {
      conversationLive: self.conversationLive,
      isParticipating: self.isParticipating,
      onOpen: self.onOpen,
      onClose: self.onClose,
      leaveCall: Realtime.leaveCall,
      joinCall: Realtime.joinCall,
      participants: self.participants.models.map(p => p.attributes),
      messages: self.messages.models.map(m => m.attributes),
      videoToggleClick: self.videoToggleClick,
      cursorToggleClick: self.cursorToggleClick,
      soundToggleClick: self.soundToggleClick,
      inputBlur: self.inputBlur,
      inputFocus: self.inputFocus,
      handleInputMessage: self.handleInputMessage
    }), document.getElementById(ChatView.domId))
  },
  onOpen: () => {
    $(document).trigger(ChatView.events.openTray)
  },
  onClose: () => {
    $(document).trigger(ChatView.events.closeTray)
  },
  addParticipant: participant => {
    ChatView.participants.add(participant)
    ChatView.render()
  },
  removeParticipant: participant => {
    ChatView.participants.remove(participant)
    ChatView.render()
  },
  addMessage: (message, isInitial, wasMe) => {
    const self = ChatView
    if (!isInitial) self.mapChat.newMessage() 

    function addZero(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
    var m = clone(message.attributes)

    m.timestamp = new Date(m.created_at)

    var date = (m.timestamp.getMonth() + 1) + '/' + m.timestamp.getDate()
    date += ' ' + addZero(m.timestamp.getHours()) + ':' + addZero(m.timestamp.getMinutes())
    m.timestamp = date
    m.image = m.user_image
    m.message = linker.link(m.message)

    self.messages.push(m)
    // TODO what is scrollMessages?
    // scrollMessages scrolls to the bottom of the div when there's new messages“
    // if (!isInitial) self.scrollMessages(200)
    self.render()

    if (!wasMe && !isInitial && self.alertSound) self.sound.play('receivechat')
  },
  handleInputMessage: text => {
    $(document).trigger(ChatView.events.message + '-' + self.room, [{ message: text }])
  },
  leaveConversation: () => {
    // TODO refactor
    // this.$participants.removeClass('is-participating')
    ChatView.isParticipating = false
    ChatView.render()
  },
  mapperJoinedCall: id => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).addClass('active')
    const mapper = ChatView.participants.findWhere({id})
    mapper && mapper.set('isParticipating', true)
    ChatView.render()
  },
  mapperLeftCall: () => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).removeClass('active')
    const mapper = ChatView.participants.findWhere({id})
    mapper && mapper.set('isParticipating', false)
    ChatView.render()
  },
  invitationPending: id => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).addClass('pending')
    const mapper = ChatView.participants.findWhere({id})
    mapper && mapper.set('isPending', true)
    ChatView.render()
  },
  invitationAnswered: id => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).removeClass('pending')
    const mapper = ChatView.participants.findWhere({id})
    mapper && mapper.set('isPending', false)
    ChatView.render()
  },
  conversationInProgress: participating => {
    ChatView.conversationLive = true
    ChatView.isParticipating = participating
    ChatView.render() 
  },
  conversationEnded: () => {
    ChatView.conversationLive = false
    ChatView.isParticipating = false
    // go through and remove isParticipating from all other participants too
    ChatView.render()
  },
  removeParticipants: () => {
    ChatView.participants.remove(ChatView.participants.models)
    ChatView.render()
  },
  close: () => {
    // TODO how to do focus with react
    // this.$messageInput.blur()
    ChatView.mapChat.close()
  },
  open: () => {
    ChatView.mapChat.open()
    // TODO how to do focus with react
    // this.$messageInput.focus()
    // TODO reimplement scrollMessages
    // this.scrollMessages(0)
  },
  videoToggleClick: function() {
    ChatView.videosShowing = !ChatView.videosShowing
    $(document).trigger(ChatView.videosShowing ? ChatView.events.videosOn : ChatView.events.videosOff)
  },
  cursorToggleClick: function() {
    ChatView.cursorsShowing = !ChatView.cursorsShowing
    $(document).trigger(ChatView.cursorsShowing ? ChatView.events.cursorsOn : ChatView.events.cursorsOff)
  },
  soundToggleClick: function() {
    ChatView.alertSound = !ChatView.alertSound
  },
  inputFocus: () => {
    $(document).trigger(ChatView.events.inputFocus)
  },
  inputBlur: () => {
    $(document).trigger(ChatView.events.inputBlur)
  }
}

// ChatView.prototype.conversationInProgress = function(participating) {
//   this.$conversationInProgress.show()
//   this.$participants.addClass('is-live')
//   if (participating) this.$participants.addClass('is-participating')
//   this.$button.addClass('active')
// }

// ChatView.prototype.conversationEnded = function() {
//   this.$conversationInProgress.hide()
//   this.$participants.removeClass('is-live')
//   this.$participants.removeClass('is-participating')
//   this.$button.removeClass('active')
//   this.$participants.find('.participant').removeClass('active')
//   this.$participants.find('.participant').removeClass('pending')
// }

// ChatView.prototype.addMessage = function(message, isInitial, wasMe) {
//   this.messages.add(message)
//   Private.addMessage.call(this, message, isInitial, wasMe)
// }
//
// ChatView.prototype.scrollMessages = function(duration) {
//   duration = duration || 0

//   this.$messages.animate({
//     scrollTop: this.$messages[0].scrollHeight
//   }, duration)
// }

// ChatView.prototype.clearMessages = function() {
//   this.unreadMessages = 0
//   this.$unread.hide()
//   this.$messages.empty()
// }

/**
 * @class
 * @static
 */
ChatView.events = {
  message: 'ChatView:message',
  openTray: 'ChatView:openTray',
  closeTray: 'ChatView:closeTray',
  inputFocus: 'ChatView:inputFocus',
  inputBlur: 'ChatView:inputBlur',
  cursorsOff: 'ChatView:cursorsOff',
  cursorsOn: 'ChatView:cursorsOn',
  videosOff: 'ChatView:videosOff',
  videosOn: 'ChatView:videosOn'
}

export default ChatView
