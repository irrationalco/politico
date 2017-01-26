class CreateProyections < ActiveRecord::Migration[5.0]
  def change
    create_table :proyections do |t|
      t.string :type

      t.timestamps
    end
  end
end
