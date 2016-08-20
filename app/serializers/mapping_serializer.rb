class MappingSerializer < ActiveModel::Serializer
  attributes :id,
             :xloc,
             :yloc,
             :created_at,
             :updated_at,
             :mappable_id,
             :mappable_type

  has_one :user, serializer: UserSerializer
  has_one :map, serializer: MapSerializer

  def filter(keys)
    keys.delete(:xloc) unless object.mappable_type == 'Topic'
    keys.delete(:yloc) unless object.mappable_type == 'Topic'
    keys
  end
end
