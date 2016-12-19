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

import Realtime from '../Realtime'
import MapChat from '../../components/MapChat'

const linker = new Autolinker({ newWindow: true, truncate: 50, email: false, phone: false })

const ChatView = {
  init: function(messages, mapper, room, opts = {}) {
    const self = ChatView
    self.room = room
    self.mapper = mapper
    self.messages = messages

    self.isOpen = false
    self.alertSound = true // whether to play sounds on arrival of new messages or not
    self.cursorsShowing = true
    self.videosShowing = true
    self.unreadMessages = 0
    self.participants = []

    self.sound = new Howl({
      src: opts.soundUrls,
      sprite: {
        joinmap: [0, 561],
        leavemap: [1000, 592],
        receivechat: [2000, 318],
        sendchat: [3000, 296],
        sessioninvite: [4000, 5393, true]
      }
    })
    $('body').prepend('<div id="chat-box-wrapper"></div>')
  },
  render: () => {
    const self = ChatView
    ReactDOM.render(React.createElement(MapChat, {
      isOpen: self.isOpen,
      leaveCall: Realtime.leaveCall,
      joinCall: Realtime.joinCall,
      participants: self.participants,
      messages: self.messages.models.map(m => m.attributes),
      unreadMessages: self.unreadMessages,
      buttonClick: self.buttonClick,
      videoToggleClick: self.videoToggleClick,
      cursorToggleClick: self.cursorToggleClick,
      soundToggleClick: self.soundToggleClick,
      inputBlur: self.inputBlur,
      inputFocus: self.inputFocus,
      videosShowing: self.videosShowing,
      cursorsShowing: self.cursorsShowing,
      alertSound: self.alertSound,
      handleInputMessage: self.handleInputMessage
    }), document.getElementById('chat-box-wrapper'))
  },
  show: () => {
    ChatView.show = true
    ChatView.render()
  },
  hide: () => {
    ChatView.show = false
    ChatView.render()
  },
  addParticipant: participant => {
    // TODO this should probably be using a Backbone collection????
    const p = participant.attributes ? clone(participant.attributes) : participant
    ChatView.participants.push(p)
    ChatView.render()
  },
  removeParticipant: participant => {
    const remove_id = participant.get('id')
    ChatView.participants = ChatView.participants.filter(p => p.id !== remove_id)
    ChatView.render()
  },
  incrementUnread: (render = false) => {
    ChatView.unreadMessages += 1
    if (render) ChatView.render()
  },
  addMessage: (message, isInitial, wasMe) => {
    const self = ChatView
    if (!self.isOpen && !isInitial) ChatView.incrementUnread(false) // TODO don't need to render, right?

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
    // if (!isInitial) self.scrollMessages(200)
    self.render()

    if (!wasMe && !isInitial && self.alertSound) self.sound.play('receivechat')
  },
  handleInputMessage: text => {
    // TODO use backbone
    ChatView.addMessage(text, false, false)
    $(document).trigger(ChatView.events.message + '-' + self.room, [{ message: text }])
  },
  leaveConversation: () => {
    // TODO refactor
    // this.$participants.removeClass('is-participating')
  },
  mapperJoinedCall: () => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).addClass('active')
  },
  mapperLeftCall: () => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).removeClass('active')
  },
  invitationPending: () => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).addClass('pending')
  },
  invitationAnswered: () => {
    // TODO refactor
    // this.$participants.find('.participant-' + id).removeClass('pending')
  },
  buttonClick: () => {
    const self = ChatView
    if (self.isOpen) self.close()
    else if (!self.isOpen) self.open()
  },
  close: () => {
    this.isOpen = false

    // TODO how to do focus with react
    // this.$messageInput.blur()

    $(document).trigger(ChatView.events.closeTray)
    ChatView.render()
  },
  open: () => {
    ChatView.unreadMessages = 0
    this.isOpen = true

    // TODO how to do focus with react
    // this.$messageInput.focus()
    // TODO reimplement scrollMessages
    // this.scrollMessages(0)

    $(document).trigger(ChatView.events.openTray)
    ChatView.render()
  },
  videoToggleClick: function() {
    const self = ChatView
    self.videosShowing = !self.videosShowing
    $(document).trigger(self.videosShowing ? ChatView.events.videosOn : ChatView.events.videosOff)
    ChatView.render()
  },
  cursorToggleClick: function() {
    const self = ChatView
    self.cursorsShowing = !self.cursorsShowing
    $(document).trigger(self.cursorsShowing ? ChatView.events.cursorsOn : ChatView.events.cursorsOff)
    ChatView.render()
  },
  soundToggleClick: function() {
    const self = ChatView
    this.alertSound = !this.alertSound
    ChatView.render()
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

// ChatView.prototype.removeParticipants = function() {
//   this.participants.remove(this.participants.models)
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

// ChatView.prototype.remove = function() {
//   this.$button.off()
//   this.$container.remove()
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
