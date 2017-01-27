class CreateProyectionData < ActiveRecord::Migration[5.0]
  def change
    create_table :proyection_data do |t|

      t.timestamps
    end
  end
end
