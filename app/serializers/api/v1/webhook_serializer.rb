module Api
  module V1
    class WebhookSerializer < ApplicationSerializer
      attributes :text, :username, :icon_url # , :attachments
    end
  end
end
