class AccessRequest < ApplicationRecord
  belongs_to :user
  belongs_to :map

  def approve
    self.approved = true
    self.answered = true
    self.save
    UserMap.create(user: self.user, map: self.map)
    # send an email and push notification here?
  end

  def deny
    self.approved = false
    self.answered = true
    self.save
    # send an email and push notification here?
  end
end
