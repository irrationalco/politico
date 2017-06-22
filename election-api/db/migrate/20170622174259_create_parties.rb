class CreateParties < ActiveRecord::Migration[5.0]
  def change
    create_table :parties do |t|
      t.string :name
      t.string :image

      t.timestamps
    end
    add_column :organizations, :party_id, :integer
  end
end
