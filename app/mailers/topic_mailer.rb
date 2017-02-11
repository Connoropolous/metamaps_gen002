# frozen_string_literal: true
class TopicMailer < ApplicationMailer
  default from: 'team@metamaps.cc'

  def added_to_map_subject(topic, map)
    topic.name + ' was added to map ' + map.name
  end

  def added_to_map(event, user)
    @entity = event.eventable
    @event = event
    mail(to: user.email, subject: added_to_map_subject(@entity, event.map))
  end

  def connected_subject(topic)
    'new synapse to topic ' + topic.name
  end

  def connected(synapse, topic, user)
    @entity = topic
    @event = synapse
    mail(to: user.email, subject: connected_subject(topic))
  end
end
