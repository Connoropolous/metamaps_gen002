class Mapping < ActiveRecord::Base

  scope :topicmapping, -> { where(mappable_type: :Topic) }
  scope :synapsemapping, -> { where(mappable_type: :Synapse) }

  belongs_to :mappable, polymorphic: true
  belongs_to :map, :class_name => "Map", :foreign_key => "map_id", touch: true
  belongs_to :user

  after_destroy :remove_defer

  validates :xloc, presence: true, 
    unless: Proc.new { |m| m.mappable_type == 'Synapse' }
  validates :yloc, presence: true,
    unless: Proc.new { |m| m.mappable_type == 'Synapse' }
  validates :map, presence: true
  validates :mappable, presence: true
  
  def user_name
    self.user.name
  end

  def user_image
    self.user.image.url
  end

  def as_json(options={})
    super(:methods =>[:user_name, :user_image])
  end

  private

    def remove_defer(mapping)
      mappable = mapping.mappable
      mappable.defer_to_map_id = nil
      mappable.save
    end
end
