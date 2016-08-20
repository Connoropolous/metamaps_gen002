module Api
  module V1
    class WebhookSerializer < ActiveModel::Serializer
      attributes :text, :username, :icon_url # , :attachments
    end
  end
end
