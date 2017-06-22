class CreatePolls < ActiveRecord::Migration[5.0]
  def change
    create_table :polls do |t|
      t.references :organization, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
