class CreateVoters < ActiveRecord::Migration[5.0]
  def change
    create_table :voters do |t|
      t.string :electoral_code
      t.string :name
      t.string :first_last_name
      t.string :second_last_name
      t.date :date_of_birth
      t.string :street
      t.string :outside_number
      t.string :inside_number
      t.string :suburb
      t.numeric :postal_code
      t.numeric :TIMERES
      t.string :occupation
      t.numeric :FOL_NAC
      t.boolean :EN_LN
      t.string :municipality_name
      t.numeric :state
      t.numeric :district
      t.numeric :municipality
      t.numeric :section
      t.numeric :locality
      t.numeric :apple
      t.numeric :CONS_LC
      t.numeric :EMISIONCRE

      t.timestamps
    end
  end
end
