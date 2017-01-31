class CreateMaps < ActiveRecord::Migration[5.0]
  def change
    create_table :maps do |t|
      t.string  :type
      t.string  :name
      t.integer :map_key
      t.string  :url
      t.float   :lat
      t.float   :long

      t.timestamps
    end
  end
end