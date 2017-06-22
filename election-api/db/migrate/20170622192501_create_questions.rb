class CreateQuestions < ActiveRecord::Migration[5.0]
  def change
    create_table :questions do |t|
      t.references :poll, foreign_key: true
      t.string :text
      t.integer :position

      t.timestamps
    end
  end
end
