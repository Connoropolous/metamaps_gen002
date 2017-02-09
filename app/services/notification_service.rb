# frozen_string_literal: true
class NotificationService
  # for strip_tags
  include ActionView::Helpers::SanitizeHelper

  def self.renderer
    renderer ||= ApplicationController.renderer.new(
      http_host: ENV['MAILER_DEFAULT_URL'],
      https:     Rails.env.production? ? true : false
    )
  end

  def self.get_template_for_event_type(event_type)
    'map_mailer/' + event_type
  end
  
  def self.get_mailboxer_code_for_event_type(event_type)
    case event_type
      when 'access_approved'
        MAILBOXER_CODE_ACCESS_APPROVED
      when 'access_request'
        MAILBOXER_CODE_ACCESS_REQUEST
      when 'invite_to_edit'
        MAILBOXER_CODE_INVITE_TO_EDIT

      when 'map_activity'
        MAILBOXER_CODE_MAP_ACTIVITY
      when 'map_collaborator_added'
        MAILBOXER_CODE_MAP_COLLABORATOR_ADDED
      when 'map_updated'
        MAILBOXER_CODE_MAP_UPDATED
      when 'map_message'
        MAILBOXER_CODE_MAP_MESSAGE
      when 'map_starred'
        MAILBOXER_CODE_MAP_STARRED
        
      when 'topic_added_to_map'
        MAILBOXER_CODE_TOPIC_ADDED_TO_MAP
      when 'topic_connected'
        MAILBOXER_CODE_TOPIC_CONNECTED
      when 'topic_deleted'
        MAILBOXER_CODE_TOPIC_DELETED
      when 'topic_disconnected'
        MAILBOXER_CODE_TOPIC_DISCONNECTED
      when 'topic_updated'
        MAILBOXER_CODE_TOPIC_UPDATED
    end
  end

  def self.get_subject_for_event(entity, event_type, event)
    case event_type
      when 'access_approved' # event is an AccessRequest
        entity.name + ' - access approved' 
      when 'access_request' # event is an AccessRequest
        entity.name + ' - request to edit'
      when 'invite_to_edit' # event is a UserMap
        entity.name + ' - invited to edit'

      when 'map_activity' #disabled
        'placeholder'
      when 'map_collaborator_added' #disabled
        'placeholder'
      when 'map_updated' #disabled
        'placeholder'
      when 'map_message' # event is a Message
        entity.name + ' - received a chat message'
      when 'map_starred' # event is a Star
        entity.name + ' was starred by ' + event.user.name
        
      when 'topic_added_to_map' # event is an Event::TopicAddedToMap
        entity.name + ' was added to map ' + event.map.name
      when 'topic_connected' # event is a Synapse
        'new synapse to topic ' + entity.name
      when 'topic_deleted' #disabled
        'placeholder'
      when 'topic_disconnected' #disabled
        'placeholder'
      when 'topic_updated' #disabled
        'placeholder'
    end
  end

  def self.send_for_follows(follows, entity, event_type, event)
    return if follows.length == 0
    template = get_template_for_event_type(event_type)
    mailboxer_code = get_mailboxer_code_for_event_type(event_type)
    subject = get_subject_for_event(entity, event_type, event)
    # we'll prbly want to put the body into the actual loop so we can pass the current user in as a local
    body = renderer.render(template: template, locals: { entity: entity, event: event }, layout: false)
    follows.each{|follow|
      # don't send if they've indicated disinterest in this event_type
      return unless follow.follow_type.all || follow.follow_type.read_attribute(event_type)
      # this handles email and in-app notifications, in the future, include push
      receipt = follow.user.notify(subject, body, event, false, mailboxer_code, (follow.user.emails_allowed && follow.email), event.user)
      # push could be handled with Actioncable to send transient notifications to the UI
      # the receipt from the notify call could be used to link to the full notification
    }
  end

  def self.notify_followers(entity, event_type, event, reason_filter = nil)
    follows = entity.follows
    
    if reason_filter.class == String && FollowReason::REASONS.include?(reason_filter)
      follows = follows.joins(:follow_reason).where('follow_reasons.' + reason_filter => true)
    elsif reason_filter.class == Array
      # TODO: throw an error here if all the reasons aren't valid
      follows = follows.joins(:follow_reason).where(reason_filter.map{|r| "follow_reasons.#{r} = 't'"}.join(' OR '))
    end
    # filter out the person who took the action
    follows = follows.to_a.delete_if{|f| f.user.id == event.user.id}
    send_for_follows(follows, entity, event_type, event)
  end


  # TODO: refactor this
  def self.access_request(request)
    event_type = 'access_request'
    template = get_template_for_event_type(event_type)
    mailboxer_code = get_mailboxer_code_for_event_type(event_type)
    subject = get_subject_for_event(request.map, event_type, request)
    body = renderer.render(template: template, locals: { map: request.map, request: request }, layout: false)
    request.map.user.notify(subject, body, request, false, mailboxer_code, true, request.user)
  end

  # TODO: refactor this
  def self.access_approved(request)
    event_type = 'access_approved'
    template = get_template_for_event_type(event_type)
    mailboxer_code = get_mailboxer_code_for_event_type(event_type)
    subject = get_subject_for_event(request.map, event_type, request)
    body = renderer.render(template: template, locals: { map: request.map }, layout: false)
    request.user.notify(subject, body, request, false, mailboxer_code, true, request.map.user)
  end

  # TODO: refactor this
  def self.invite_to_edit(user_map)
    event_type = 'invite_to_edit'
    template = get_template_for_event_type(event_type)
    mailboxer_code = get_mailboxer_code_for_event_type(event_type)
    subject = get_subject_for_event(user_map.map, event_type, user_map)
    body = renderer.render(template: template, locals: { map: user_map.map, inviter: user_map.map.user }, layout: false)
    user_map.user.notify(subject, body, user_map, false, mailboxer_code, true, user_map.map.user)
  end

  # note: this is a global function, probably called from the rails console with some html body
  def self.message_from_devs(subject, body, opts = {})
    users = opts[:users] || User.all
    obj = opts[:obj] || nil
    sanitize_text = opts[:sanitize_text] || false
    notification_code = opts[:notification_code] || MAILBOXER_CODE_MESSAGE_FROM_DEVS
    send_mail = opts[:send_mail] || true
    sender = opts[:sender] || User.find_by(email: 'ishanshapiro@gmail.com')
    Mailboxer::Notification.notify_all(users, subject, body, obj, sanitize_text, notification_code, send_mail, sender)
  end

  def self.text_for_notification(notification)
    case notification.notification_code
      when MAILBOXER_CODE_ACCESS_APPROVED
        map = notification.notified_object.map
        'granted your request to edit map <span class="in-bold">' + map.name + '</span>'
      when MAILBOXER_CODE_ACCESS_REQUEST
        map = notification.notified_object.map
        'wants permission to map with you on <span class="in-bold">' + map.name + '</span>&nbsp;&nbsp;<div class="action">Offer a response</div>'
      when MAILBOXER_CODE_INVITE_TO_EDIT
        map = notification.notified_object.map
        'gave you edit access to map  <span class="in-bold">' + map.name + '</span>'
      when MAILBOXER_CODE_MAP_MESSAGE
        map = notification.notified_object.resource
        'commented on map  <span class="in-bold">' + map.name + '</span>'
      when MAILBOXER_CODE_MAP_STARRED
        map = notification.notified_object.map
        'starred map  <span class="in-bold">' + map.name + '</span>'
      when MAILBOXER_CODE_TOPIC_ADDED_TO_MAP
        topic = notification.notified_object.eventable
        map = notification.notified_object.map
        'added topic <span class="in-bold">' + topic.name + '</span> to map <span class="in-bold">' + map.name + '</span>'  
      when MAILBOXER_CODE_TOPIC_CONNECTED
        topic1 = notification.notified_object.topic1
        topic2 = notification.notified_object.topic2
        'connected <span class="in-bold">' + topic1.name + '</span> to <span class="in-bold">' + topic2.name + '</span>'
      when MAILBOXER_CODE_MESSAGE_FROM_DEVS
        notification.subject
    end
  end
end
