# frozen_string_literal: true
class FollowType < ApplicationRecord
  belongs_to :follow
  
  validates :follow, presence: true
end