class SynapseSerializer < ActiveModel::Serializer
  attributes :id,
             :desc,
             :category,
             :weight,
             :permission,
             :created_at,
             :updated_at

  has_one :topic1, root: :topics, serializer: TopicSerializer
  has_one :topic2, root: :topics, serializer: TopicSerializer
  has_one :user, serializer: UserSerializer
end
