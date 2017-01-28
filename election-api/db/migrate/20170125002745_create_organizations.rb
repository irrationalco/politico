class CreateOrganizations < ActiveRecord::Migration[5.0]
  def change
    create_table :organizations do |t|
      # Attributes
      t.string :name
      t.timestamps
      
      # Foreign keys
      t.integer :admin_id
      t.integer :proyection_id
    end
  end
end
