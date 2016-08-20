module Api
  module V1
    class RestfulController < ActionController::Base
      include Pundit
      include PunditExtra

      snorlax_used_rest!

      load_and_authorize_resource only: [:show, :update, :destroy]
      
      def create
        instantiate_resource
        resource.user = current_user
        authorize resource
        create_action
        respond_with_resource
      end

      private

      def accessible_records
        if current_user
          visible_records
        else
          public_records
        end
      end

      def current_user
        super || token_user || doorkeeper_user || nil
      end

      def resource_serializer
        "Api::V1::#{resource_name.camelize}Serializer".constantize
      end

      def respond_with_resource(scope: default_scope, serializer: resource_serializer, root: serializer_root)
        if resource.errors.empty?
          render json: resource, scope: scope, serializer: serializer, root: root
        else
          respond_with_errors
        end
      end

      def respond_with_collection(resources: collection, scope: default_scope, serializer: resource_serializer, root: serializer_root)
        render json: resources, scope: scope, each_serializer: serializer, root: root, meta: pagination(resources), meta_key: :page
      end

      def default_scope
        {
          embeds: embeds
        }
      end

      def embeds
        (params[:embed] || '').split(',').map(&:to_sym)
      end

      def token_user
        token = params[:access_token]
        access_token = Token.find_by_token(token)
        @token_user ||= access_token.user if access_token
      end

      def doorkeeper_user
        return unless doorkeeper_token.present?
        doorkeeper_render_error unless valid_doorkeeper_token?
        @doorkeeper_user ||= User.find(doorkeeper_token.resource_owner_id)
      end

      def permitted_params
        @permitted_params ||= PermittedParams.new(params)
      end

      def serializer_root
        'data'
      end

      def pagination(collection)
        per = (params[:per] || 25).to_i
        current_page = params[:page].to_i
        total_pages = (collection.total_count / per).to_i + 1
        prev_page = current_page > 1 ? current_page - 1 : 0
        next_page = current_page < total_pages ? current_page + 1 : 0
        {
          current_page: current_page,
          next_page: next_page,
          prev_page: prev_page,
          total_pages: total_pages,
          total_count: collection.total_count
        }
      end

      def instantiate_collection
        collection = accessible_records
        collection = yield collection if block_given?
        collection = collection.page(params[:page]).per(params[:per])
        self.collection = collection
      end

      def visible_records
        policy_scope(resource_class)
      end

      def public_records
        policy_scope(resource_class)
      end
    end
  end
end
