class CreateAnswers < ActiveRecord::Migration[5.0]
  def change
    create_table :answers do |t|
      t.references :person, foreign_key: true
      t.references :question, foreign_key: true
      t.text :answer

      t.timestamps
    end
  end
end
