class AddStatesTable < ActiveRecord::Migration[5.0]
  def change
    create_table :states do |t|
      t.string  :name
      t.integer :state_code

      t.timestamps
    end
  end
end
