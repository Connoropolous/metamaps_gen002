/* global $, ActionCable */

import Active from './Active'
import DataModel from './DataModel'
import Topic from './Topic'

const Cable = {
  init: () => {
    let self = Cable
    self.cable = ActionCable.createConsumer()
  },
  subTopic: id => {
    let self = Cable
    self.topicSubs[id] = self.cable.subscriptions.create({
      channel: 'TopicChannel',
      id: id
    }, {
      received: event => self[event.type](event.data)
    }) 
  },
  unsubAllTopics: () => {
    let self = Cable
    Object.keys(self.topicSubs).forEach(id => {
      self.topicSubs[id].unsubscribe()
    })
    self.topicSubs = {}
  },
  newSynapse: data => {
    const m = Active.Mapper
    const s = new DataModel.Synapse(data.synapse)
    const t1 = new DataModel.Topic(data.topic1)
    const t2 = new DataModel.Topic(data.topic2)
    if (t1.authorizeToShow(m) && t2.authorizeToShow(m) && s.authorizeToShow(m)) {
      Topic.fetchForTopicView(data.synapse.id)
    }
  }
}

export default Cable
