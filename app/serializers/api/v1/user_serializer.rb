module Api
  module V1
    class UserSerializer < ApplicationSerializer
      attributes :id,
        :name,
        :avatar,
        :is_admin,
        :generation

      def avatar
        object.image.url(:sixtyfour)
      end

      def is_admin
        object.admin
      end
    end
  end
end
