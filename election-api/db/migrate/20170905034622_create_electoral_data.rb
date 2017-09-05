class CreateElectoralData < ActiveRecord::Migration[5.0]
  def change
    create_table :electoral_data do |t|
      t.string, :electoral_code
      t.string, :name
      t.string, :first_last_name
      t.string, :second_last_name
      t.date, :date_of_birth
      t.string, :street
      t.string, :outside_number
      t.string, :inside_number
      t.string, :suburb
      t.number, :postal_code
      t.number, :TIMERES
      t.string, :occupation
      t.number, :FOL_NAC
      t.boolean, :EN_LN
      t.string, :municipality_name
      t.number, :state
      t.number, :district
      t.number, :municipality
      t.number, :section
      t.number, :locality
      t.number, :apple
      t.number, :CONS_LC
      t.number :EMISIONCRE

      t.timestamps
    end
  end
end
