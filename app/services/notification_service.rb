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

  def self.get_subject_for_event(entity, event_type, event)
    case event_type
      when TOPIC_ADDED_TO_MAP # event is an Event::TopicAddedToMap
        entity.name + ' was added to map ' + event.map.name
      when TOPIC_CONNECTED # event is a Synapse
        'new synapse to topic ' + entity.name
    end
  end

  def self.send_for_follows(follows, entity, event_type, event)
    return if follows.length == 0
    template = 'map_mailer/' + event_type.downcase
    subject = get_subject_for_event(entity, event_type, event)
    # we'll prbly want to put the body into the actual loop so we can pass the current user in as a local
    body = renderer.render(template: template, locals: { entity: entity, event: event }, layout: false)
    follows.each{|follow|
      # this handles email and in-app notifications, in the future, include push
      follow.user.notify(subject, body, event, false, event_type, (follow.user.emails_allowed && follow.email), event.user)
      # push could be handled with Actioncable to send transient notifications to the UI
      # the receipt from the notify call could be used to link to the full notification
    }
  end

  def self.notify_followers(entity, event_type, event, reason_filter = nil, exclude_follows = nil)
    follows = entity.follows.joins(:follow_type).where.not(user_id: event.user.id)
    
    if exclude_follows
      follows = follows.where.not(id: exclude_follows)
    end
    
    if reason_filter.class == String && FollowReason::REASONS.include?(reason_filter)
      follows = follows.joins(:follow_reason).where('follow_reasons.' + reason_filter => true)
    elsif reason_filter.class == Array
      # TODO: throw an error here if all the reasons aren't valid
      follows = follows.joins(:follow_reason).where(reason_filter.map{|r| "follow_reasons.#{r} = 't'"}.join(' OR '))
    end
    send_for_follows(follows, entity, event_type, event)
    return follows.map(&:id)
  end

  def self.access_request(request)
    subject = MapMailer.access_request_subject(request.map)
    body = renderer.render(template: 'map_mailer/access_request', locals: { map: request.map, request: request }, layout: false)
    request.map.user.notify(subject, body, request, false, MAILBOXER_CODE_ACCESS_REQUEST, true, request.user)
  end

  def self.access_approved(request)
    subject = MapMailer.access_approved_subject(request.map)
    body = renderer.render(template: 'map_mailer/access_approved', locals: { map: request.map }, layout: false)
    request.user.notify(subject, body, request, false, MAILBOXER_CODE_ACCESS_APPROVED, true, request.map.user)
  end

  def self.invite_to_edit(user_map)
    subject = MapMailer.invite_to_edit_subject(user_map.map)
    body = renderer.render(template: 'map_mailer/invite_to_edit', locals: { map: user_map.map, inviter: user_map.map.user }, layout: false)
    user_map.user.notify(subject, body, user_map, false, MAILBOXER_CODE_INVITE_TO_EDIT, true, user_map.map.user)
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
