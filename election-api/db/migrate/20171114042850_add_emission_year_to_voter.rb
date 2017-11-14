class AddEmissionYearToVoter < ActiveRecord::Migration[5.0]
  def change
    add_column :voters, :emission_year, :numeric
  end
end
