module Api
  module V1
    class MapSerializer < ActiveModel::Serializer
      attributes :id,
        :name,
        :desc,
        :permission,
        :screenshot,
        :created_at,
        :updated_at

      has_many :topics, serializer: TopicSerializer
      has_many :synapses, serializer: SynapseSerializer
      has_many :mappings, serializer: MappingSerializer
      has_many :contributors, root: :users, serializer: UserSerializer
      has_many :collaborators, root: :users, serializer: UserSerializer
    end
  end
end
