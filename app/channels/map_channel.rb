class MapChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber of this channel.
  def subscribed
    # verify permission
    stream_from "map_#{params[:id]}"
  end
end