class CreatePolls < ActiveRecord::Migration[5.0]
  def change
    create_table :polls do |t|
      t.string :name
      t.integer :total_sections
      t.timestamps
    end
  end
end
