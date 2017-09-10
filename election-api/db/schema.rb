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

ActiveRecord::Schema.define(version: 20170905051858) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "favorites", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "projection_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "municipalities", force: :cascade do |t|
    t.string   "name"
    t.integer  "muni_code"
    t.integer  "state_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "state_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "admin_id"
  end

  create_table "polls", force: :cascade do |t|
    t.string   "name"
    t.integer  "total_sections"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "projections", force: :cascade do |t|
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "section_code"
    t.integer  "muni_code"
    t.integer  "state_code"
    t.integer  "district_code"
    t.integer  "nominal_list"
    t.integer  "year"
    t.string   "election_type"
    t.integer  "PAN"
    t.integer  "PCONV"
    t.integer  "PES"
    t.integer  "PH"
    t.integer  "PMC"
    t.integer  "PMOR"
    t.integer  "PNA"
    t.integer  "PPM"
    t.integer  "PRD"
    t.integer  "PRI"
    t.integer  "PSD"
    t.integer  "PSM"
    t.integer  "PT"
    t.integer  "PVEM"
    t.integer  "total_votes"
    t.integer  "organization_id"
  end

  create_table "sections", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "poll_id"
  end

  create_table "state_caches", force: :cascade do |t|
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "state_code"
    t.integer  "year"
    t.string   "election_type"
    t.integer  "PAN"
    t.integer  "PCONV"
    t.integer  "PES"
    t.integer  "PH"
    t.integer  "PMC"
    t.integer  "PMOR"
    t.integer  "PNA"
    t.integer  "PPM"
    t.integer  "PRD"
    t.integer  "PRI"
    t.integer  "PSD"
    t.integer  "PSM"
    t.integer  "PT"
    t.integer  "PVEM"
    t.integer  "total_votes"
  end

  create_table "states", force: :cascade do |t|
    t.string   "name"
    t.integer  "state_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                             default: "",    null: false
    t.string   "encrypted_password",                default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                     default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.string   "authentication_token",   limit: 30
    t.string   "first_name",             limit: 35
    t.string   "last_name",              limit: 35
    t.boolean  "superadmin",                        default: false
    t.boolean  "supervisor",                        default: false
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true, using: :btree
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "voters", force: :cascade do |t|
    t.string   "electoral_code"
    t.string   "name"
    t.string   "first_last_name"
    t.string   "second_last_name"
    t.date     "date_of_birth"
    t.string   "street"
    t.string   "outside_number"
    t.string   "inside_number"
    t.string   "suburb"
    t.decimal  "postal_code"
    t.decimal  "TIMERES"
    t.string   "occupation"
    t.decimal  "FOL_NAC"
    t.boolean  "EN_LN"
    t.string   "municipality_name"
    t.decimal  "state"
    t.decimal  "district"
    t.decimal  "municipality"
    t.decimal  "section"
    t.decimal  "locality"
    t.decimal  "apple"
    t.decimal  "CONS_LC"
    t.decimal  "EMISIONCRE"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

end
