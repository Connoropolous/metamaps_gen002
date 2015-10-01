class MapSerializer < ActiveModel::Serializer
  embed :ids, include: true

  attributes :id,
             :name,
             :desc,
             :permission

  #has_one :author, serializer: UserSerializer, root: 'users'
  #has_one :group, serializer: GroupSerializer, root: 'groups'
  #has_one :active_proposal, serializer: MotionSerializer, root: 'proposals'

  #def author
  #  object.author
  #end

end
