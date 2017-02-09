class CreateFollowTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :follow_types do |t|
      t.references  :follow, index: true
      t.boolean     :all, default: true
      t.boolean     :acccess_approved
      t.boolean     :access_request
      t.boolean     :invite_to_edit
      t.boolean     :map_activity
      t.boolean     :map_collaborator_added
      t.boolean     :map_message
      t.boolean     :map_starred
      t.boolean     :map_updated
      t.boolean     :topic_added_to_map
      t.boolean     :topic_connected
      t.boolean     :topic_deleted
      t.boolean     :topic_disconnected
      t.boolean     :topic_updated
      t.timestamps
    end
  end
end
