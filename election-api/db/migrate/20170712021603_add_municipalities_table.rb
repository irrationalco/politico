class AddMunicipalitiesTable < ActiveRecord::Migration[5.0]
  def change
    create_table :municipalities do |t|
      t.string  :name
      t.integer :muni_code

      t.timestamps

      # Foreign keys
      t.integer :state_id
    end
  end
end
