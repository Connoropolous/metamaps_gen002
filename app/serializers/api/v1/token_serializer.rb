module Api
  module V1
    class TokenSerializer < ApplicationSerializer
      attributes :id,
        :token,
        :description,
        :created_at,
        :updated_at
    end
  end
end
