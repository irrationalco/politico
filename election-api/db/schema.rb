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

ActiveRecord::Schema.define(version: 20170630025240) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "TestTable", force: :cascade do |t|
  end

  create_table "favorites", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "projection_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
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

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

end
