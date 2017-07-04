class CreateProjections < ActiveRecord::Migration[5.0]
  def change
    create_table :projections do |t|
      t.timestamps
      t.integer :section_code
      t.integer :muni_code
      t.integer :state_code
      t.integer :district_code
      t.integer :nominal_list
      t.integer :year
      t.string  :election_type

      t.integer :PAN
      t.integer :PCONV
      t.integer :PDSPPN
      t.integer :PES
      t.integer :PH
      t.integer :PMC
      t.integer :PMOR
      t.integer :PNA
      t.integer :PPM
      t.integer :PRD
      t.integer :PRI
      t.integer :PSD
      t.integer :PSM
      t.integer :PSN
      t.integer :PT
      t.integer :PVEM

      t.integer :total_votes

      # Foreign Keys
      t.integer :organization_id

      t.timestamps
    end
  end
end
