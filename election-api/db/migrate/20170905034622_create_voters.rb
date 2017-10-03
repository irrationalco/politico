class CreateVoters < ActiveRecord::Migration[5.0]
  def change
    create_table :voters do |t|
      
      t.string :captured_by
      
      t.string :electoral_id_number
      t.numeric :expiration_date

      t.string :first_name
      t.string :second_name
      t.string :first_last_name
      t.string :second_last_name
      t.string :gender
      t.date   :date_of_birth
      t.string :electoral_code
      t.string :CURP

      t.numeric :section
      t.string :street
      t.string :outside_number
      t.string :inside_number
      t.string :suburb
      t.numeric :locality_code
      t.string :locality
      t.numeric :municipality_code
      t.string :municipality
      t.numeric :state_code
      t.string :state
      t.numeric :postal_code
      
      t.numeric :home_phone
      t.numeric :mobile_phone
      t.string :email
      t.string :alternative_email
      t.string :facebook_account

      t.string :highest_educational_level
      t.string :current_ocupation

      t.string :organization
      t.string :party_positions_held
      t.boolean :is_part_of_party
      t.boolean :has_been_candidate
      t.string :popular_election_position
      t.numeric :election_year
      t.boolean :won_election
      t.string :election_route
      t.string :notes

      t.timestamps
    end
  end
end
