class UserPreference
  attr_accessor :metacodes

  def initialize
    array = []
    %w(Con Event Group Idea Insight Intention Need Opportunity Person Pro Problem Project Question Wildcard).each do |m|
      metacode = Metacode.find_by_name(m)
      array.push(metacode.id.to_s) if metacode
    end
    @metacodes = array
  end
end
