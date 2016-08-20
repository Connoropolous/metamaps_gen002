class TopicSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :desc,
             :link,
             :permission,
             :created_at,
             :updated_at

  has_one :user, serializer: UserSerializer
  has_one :metacode, serializer: MetacodeSerializer
end
