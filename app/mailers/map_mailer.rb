# frozen_string_literal: true
class MapMailer < ApplicationMailer
  default from: 'team@metamaps.cc'

# when 'map_message' # disabled  , but event is a Message
#   entity.name + ' - received a chat message'
# when 'map_starred' # event is a Star
#   entity.name + ' was starred by ' + event.user.name

  def access_approved_subject(map)
    map.name + ' - access approved'
  end

  def access_approved(request)
    @request = request
    @map = request.map
    mail(to: request.user, subject: access_approved_subject(@map))
  end

  def access_request_subject(map)
    map.name + ' - request to edit'
  end

  def access_request(request)
    @request = request
    @map = request.map
    mail(to: @map.user.email, subject: access_request_subject(@map))
  end

  def invite_to_edit_subject(map)
    map.name + ' - invited to edit'
  end

  def invite_to_edit(user_map)
    @inviter = user_map.map.user
    @map = user_map.map
    mail(to: user_map.user.email, subject: invite_to_edit_subject(@map))
  end
end
