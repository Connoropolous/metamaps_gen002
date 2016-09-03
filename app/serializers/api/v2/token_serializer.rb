module Api
  module V2
    class TokenSerializer < ApplicationSerializer
      attributes :id,
        :token,
        :description,
        :created_at,
        :updated_at
    end
  end
end
