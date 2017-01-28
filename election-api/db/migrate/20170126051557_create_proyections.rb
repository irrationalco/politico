class CreateProyections < ActiveRecord::Migration[5.0]
  def change
    create_table :proyections do |t|
      t.string :type
      t.integer :map_key
      t.timestamps

      # Foreign Keys
      t.integer :organization_id
    end
  end
end
