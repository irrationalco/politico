class CreateProjections < ActiveRecord::Migration[5.0]
  def change
    create_table :projections do |t|
      t.timestamps
      t.integer :section_code
      t.integer :city_code
      t.integer :state_code
      t.integer :district_code

      t.integer :PRI
      t.integer :PAN
      t.integer :PRD
      t.integer :PV
      t.integer :PT
      t.integer :Morena
      t.integer :MC

      # Foreign Keys
      t.integer :organization_id

      t.timestamps
    end
  end
end
