/* global $ */

import React from 'react'
import ReactDOM from 'react-dom'

import Active from '../Active'
import Visualize from '../Visualize'
import GlobalUI, { ReactApp } from '../GlobalUI'

const TopicCard = {
  openTopic: null, // stores the topic that's currently open
  metacodeSets: [],
  updateTopic: () => {},
  onTopicFollow: () => {},
  redrawCanvas: () => {
    Visualize.mGraph.plot()
  },
  init: function(serverData) {
    const self = TopicCard
    self.metacodeSets = serverData.metacodeSets
  },
  populateShowCard: function(topic) {
    const self = TopicCard
    TopicCard.updateTopic = obj => {
      topic.save(obj, { success: topic => self.populateShowCard(topic) })
    }
    TopicCard.onTopicFollow = () => {
      const isFollowing = topic.isFollowedBy(Active.Mapper)
      $.post({
        url: `/topics/${topic.id}/${isFollowing ? 'un' : ''}follow`
      })
      if (isFollowing) {
        GlobalUI.notifyUser('You are no longer following this topic')
        Active.Mapper.unfollowTopic(topic.id)
      } else {
        GlobalUI.notifyUser('You are now following this topic')
        Active.Mapper.followTopic(topic.id)
      }
      self.populateShowCard(topic)
    }
    // initialize draggability
    $('.showcard').draggable({
      handle: '.metacodeImage',
      stop: function() {
        $(this).height('auto')
      }
    })
    ReactApp.render()
  },
  showCard: function(node, opts = {}) {
    var self = TopicCard
    var topic = node.getData('topic')
    self.openTopic = topic
    // populate the card that's about to show with the right topics data
    self.populateShowCard(topic)
    return $('.showcard').fadeIn('fast', () => opts.complete && opts.complete())
  },
  hideCard: function() {
    var self = TopicCard
    $('.showcard').fadeOut('fast')
    self.openTopic = null
  }
}

export default TopicCard
