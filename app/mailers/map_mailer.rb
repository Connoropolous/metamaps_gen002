# frozen_string_literal: true
class MapMailer < ApplicationMailer
  default from: 'team@metamaps.cc'

  def access_request(request)
    @request = request
    @map = request.map
    mail(to: @map.user.email, subject: NotificationService.get_subject_for_event(@map, 'access_request', request))
  end

  def access_approved(request)
    @request = request
    @map = request.map
    mail(to: request.user, subject: NotificationService.get_subject_for_event(@map, 'access_approved', request))
  end

  def invite_to_edit(user_map)
    @inviter = user_map.map.user
    @map = user_map.map
    mail(to: user_map.user.email, subject: NotificationService.get_subject_for_event(@map, 'invite_to_edit', user_map))
  end
end
