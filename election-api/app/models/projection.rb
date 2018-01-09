class Projection < ApplicationRecord
  # belongs_to :organization, required: false
  # has_one    :favorite, required: false

  scope :municipal, -> (state_code, muni_code, year, election_type) {
    where([
            'state_code = ? AND muni_code = ? 
            AND year = ? AND election_type = ?', state_code, muni_code, year, election_type
          ])
  }

  scope :distrital, -> (state_code, district_code, year, election_type) {
    where([
            'state_code = ? AND district_code = ? 
            AND year = ? AND election_type = ?', state_code, district_code, year, election_type
          ])
  }

end