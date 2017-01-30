class CreateProyections < ActiveRecord::Migration[5.0]
  def change
    create_table :proyections do |t|
      t.timestamps

      # Foreign Keys
      t.integer :organization_id
      t.integer :map_id
    end
  end
end
