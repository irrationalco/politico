class CreateProjections < ActiveRecord::Migration[5.0]
  def change
    create_table :projections do |t|
      t.timestamps

      # Foreign Keys
      t.integer :organization_id
    end
  end
end
