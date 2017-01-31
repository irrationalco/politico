class CreateMaps < ActiveRecord::Migration[5.0]
  def change
    create_table :maps do |t|
      t.string  :type
      t.string  :name
      t.string  :map_scope
      t.integer :map_key
      t.string  :url
      t.float   :lat
      t.float   :long
      t.integer :scale

      t.timestamps
    end
  end
end
