class CreateSuborganizations < ActiveRecord::Migration[5.0]
  def change
    create_table :suborganizations do |t|
      t.string  :name

      # Foreign Keys
      t.integer :manager_id
      t.integer :organization_id
      t.timestamps
    end
  end
end
