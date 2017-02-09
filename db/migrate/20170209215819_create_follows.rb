class CreateFollows < ActiveRecord::Migration[5.0]
  def change
    create_table :follows do |t|
      t.references  :user, index: true
      t.boolean     :email, default: true
      t.boolean     :app, default: true
      t.boolean     :push, default: true
      t.references  :followed, polymorphic: true, index: true
      t.timestamps
    end
  end
end
