class Projection < ApplicationRecord
  # belongs_to :organization, required: false
  # has_one    :favorite, required: false

  scope :municipal, -> (state_code, muni_code) {
    where([
      'state_code = ? AND muni_code = ? 
       AND year = ? AND election_type = ?', state_code, muni_code, 2012, 'prs'
      ]
    )
  }

  scope :distrital, -> (state_code, district_code) {
    where([
      'state_code = ? AND district_code = ? 
       AND year = ? AND election_type = ?', state_code, district_code, 2012, 'prs'
      ]
    )
  }

end
