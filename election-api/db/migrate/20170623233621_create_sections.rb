class CreateSections < ActiveRecord::Migration[5.0]
  def change
    create_table :sections do |t|
      t.string :title
      t.references :poll, foreign_key: true
      t.integer :position

      t.timestamps
    end

    create_table :candidates_sections, id: false do |t|
      t.references :section, foreign_key: true
      t.references :candidate, foreign_key: true
    end

    remove_foreign_key :questions, :polls
    remove_index :questions, name: :index_questions_on_poll_id
    remove_column :questions, :poll_id, :integer
    change_table :questions do |t|
      t.references :section, foreign_key: true
    end
  end
end
