# frozen_string_literal: true
class Follow < ApplicationRecord

  belongs_to :user
  belongs_to :followed, polymorphic: true
  has_one    :follow_reason, dependent: :destroy
  has_one    :follow_type, dependent: :destroy
  
  validates :user, presence: true
  validates :followed, presence: true
  validates :user, uniqueness: { scope: :followed, message: 'This entity is already followed by this user' }
  
  after_create :add_subsettings
  
  private

  def add_subsettings
    follow_reason = FollowReason.create!(follow: self)
    follow_type = FollowType.create!(follow: self)
  end
end
