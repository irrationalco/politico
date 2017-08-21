class CreateStateCaches < ActiveRecord::Migration[5.0]
  def change
    create_table :state_caches do |t|
      t.timestamps

      t.integer :state_code
      t.integer :year
      t.string  :election_type

      t.integer :PAN
      t.integer :PCONV
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
      t.integer :PT
      t.integer :PVEM

      t.integer :total_votes
    end
  end
end