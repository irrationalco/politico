class AddAnswerAndTypeToQuestion < ActiveRecord::Migration[5.0]
  def change
    change_table :questions do |t|
      t.string :type
      t.jsonb :parameters
    end
  end
end
