# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150930233907) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "events", force: :cascade do |t|
    t.string   "kind",           limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "eventable_id"
    t.string   "eventable_type", limit: 255
    t.integer  "user_id"
    t.integer  "map_id"
    t.integer  "sequence_id"
  end

  add_index "events", ["created_at"], name: "index_events_on_created_at", using: :btree
  add_index "events", ["map_id", "sequence_id"], name: "index_events_on_map_id_and_sequence_id", unique: true, using: :btree
  add_index "events", ["map_id"], name: "index_events_on_map_id", using: :btree
  add_index "events", ["eventable_type", "eventable_id"], name: "index_events_on_eventable_type_and_eventable_id", using: :btree
  add_index "events", ["sequence_id"], name: "index_events_on_sequence_id", using: :btree

  create_table "in_metacode_sets", force: :cascade do |t|
    t.integer  "metacode_id"
    t.integer  "metacode_set_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "in_metacode_sets", ["metacode_id"], name: "index_in_metacode_sets_on_metacode_id", using: :btree
  add_index "in_metacode_sets", ["metacode_set_id"], name: "index_in_metacode_sets_on_metacode_set_id", using: :btree

  create_table "mappings", force: :cascade do |t|
    t.text     "category"
    t.integer  "xloc"
    t.integer  "yloc"
    t.integer  "topic_id"
    t.integer  "synapse_id"
    t.integer  "map_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "maps", force: :cascade do |t|
    t.text     "name"
    t.boolean  "arranged"
    t.text     "desc"
    t.text     "permission"
    t.integer  "user_id"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.boolean  "featured"
    t.string   "screenshot_file_name"
    t.string   "screenshot_content_type"
    t.integer  "screenshot_file_size"
    t.datetime "screenshot_updated_at"
  end

  create_table "metacode_sets", force: :cascade do |t|
    t.string   "name"
    t.text     "desc"
    t.integer  "user_id"
    t.boolean  "mapperContributed"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "metacode_sets", ["user_id"], name: "index_metacode_sets_on_user_id", using: :btree

  create_table "metacodes", force: :cascade do |t|
    t.text     "name"
    t.string   "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "color"
  end

  create_table "synapses", force: :cascade do |t|
    t.text     "desc"
    t.text     "category"
    t.text     "weight"
    t.text     "permission"
    t.integer  "node1_id"
    t.integer  "node2_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "topics", force: :cascade do |t|
    t.text     "name"
    t.text     "desc"
    t.text     "link"
    t.text     "permission"
    t.integer  "user_id"
    t.integer  "metacode_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "audio_file_name"
    t.string   "audio_content_type"
    t.integer  "audio_file_size"
    t.datetime "audio_updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.text     "settings"
    t.string   "code",                   limit: 8
    t.string   "joinedwithcode",         limit: 8
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "persistence_token"
    t.string   "perishable_token"
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.string   "encrypted_password",     limit: 128, default: ""
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.string   "reset_password_token"
    t.datetime "last_sign_in_at"
    t.string   "last_sign_in_ip"
    t.integer  "sign_in_count",                      default: 0
    t.datetime "current_sign_in_at"
    t.string   "current_sign_in_ip"
    t.datetime "reset_password_sent_at"
    t.boolean  "admin"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.integer  "generation"
  end

  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "webhooks", force: :cascade do |t|
    t.integer "hookable_id"
    t.string  "hookable_type"
    t.string  "kind",                       null: false
    t.string  "uri",                        null: false
    t.text    "event_types",   default: [],              array: true
  end

  add_index "webhooks", ["hookable_type", "hookable_id"], name: "index_webhooks_on_hookable_type_and_hookable_id", using: :btree

end
