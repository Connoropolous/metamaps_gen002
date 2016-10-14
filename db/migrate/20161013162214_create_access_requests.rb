class CreateAccessRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :access_requests do |t|
      t.references :user, foreign_key: true
      t.boolean :approved
      t.boolean :answered
      t.references :map, foreign_key: true

      t.timestamps
    end
  end
end
