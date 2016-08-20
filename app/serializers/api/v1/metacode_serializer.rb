module Api
  module V1
    class MetacodeSerializer < ApplicationSerializer
      attributes :id,
        :name,
        :manual_icon,
        :color,
        :aws_icon
    end
  end
end
