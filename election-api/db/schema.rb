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

ActiveRecord::Schema.define(version: 20170624010154) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answers", force: :cascade do |t|
    t.integer  "person_id"
    t.integer  "question_id"
    t.text     "answer"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["person_id"], name: "index_answers_on_person_id", using: :btree
    t.index ["question_id"], name: "index_answers_on_question_id", using: :btree
  end

  create_table "candidates", force: :cascade do |t|
    t.string   "name"
    t.integer  "party_id"
    t.string   "photo"
    t.string   "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["party_id"], name: "index_candidates_on_party_id", using: :btree
  end

  create_table "candidates_sections", id: false, force: :cascade do |t|
    t.integer "section_id"
    t.integer "candidate_id"
    t.index ["candidate_id"], name: "index_candidates_sections_on_candidate_id", using: :btree
    t.index ["section_id"], name: "index_candidates_sections_on_section_id", using: :btree
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
    t.integer  "party_id"
  end

  create_table "parties", force: :cascade do |t|
    t.string   "name"
    t.string   "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "people", force: :cascade do |t|
    t.date     "birthDate"
    t.string   "gender"
    t.string   "city"
    t.string   "email"
    t.string   "phone"
    t.string   "postalCode"
    t.string   "electoralSection"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "polls", force: :cascade do |t|
    t.integer  "organization_id"
    t.string   "name"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["organization_id"], name: "index_polls_on_organization_id", using: :btree
  end

  create_table "projections", force: :cascade do |t|
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "section_code"
    t.integer  "muni_code"
    t.integer  "state_code"
    t.integer  "district_code"
    t.integer  "PRI"
    t.integer  "PAN"
    t.integer  "PRD"
    t.integer  "PV"
    t.integer  "PT"
    t.integer  "Morena"
    t.integer  "MC"
    t.integer  "total_votes"
    t.integer  "organization_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string   "text"
    t.integer  "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "section_id"
    t.string   "type"
    t.jsonb    "parameters"
    t.index ["section_id"], name: "index_questions_on_section_id", using: :btree
  end

  create_table "sections", force: :cascade do |t|
    t.string   "title"
    t.integer  "poll_id"
    t.integer  "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["poll_id"], name: "index_sections_on_poll_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  add_foreign_key "answers", "people"
  add_foreign_key "answers", "questions"
  add_foreign_key "candidates", "parties"
  add_foreign_key "candidates_sections", "candidates"
  add_foreign_key "candidates_sections", "sections"
  add_foreign_key "polls", "organizations"
  add_foreign_key "questions", "sections"
  add_foreign_key "sections", "polls"
end
