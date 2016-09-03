module Api
  module V2
    class SynapseSerializer < ApplicationSerializer
      attributes :id,
        :desc,
        :category,
        :weight,
        :permission,
        :created_at,
        :updated_at

      #has_one :topic1, root: :topics, serializer: TopicSerializer
      #has_one :topic2, root: :topics, serializer: TopicSerializer
      #has_one :user, serializer: UserSerializer

      def self.embeddable
        {
          topic1: { attr: :node1, serializer: TopicSerializer },
          topic2: { attr: :node2, serializer: TopicSerializer },
          user: {}
        }
      end

      self.class_eval do
        embed_dat
      end
    end
  end
end
