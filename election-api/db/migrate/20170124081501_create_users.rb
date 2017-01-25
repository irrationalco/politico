class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      # Attributes
      t.string :name
      t.string :email
      t.timestamps

      # Foreign Keys
      t.integer :organization_id
    end
  end
end