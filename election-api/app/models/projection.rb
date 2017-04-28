class Projection < ApplicationRecord
  # belongs_to :organization, required: false
  # has_one    :favorite, required: false

  scope :municipal, -> (state_code, muni_code) {
    where([
      'state_code = ? AND muni_code = ?', state_code, muni_code
      ]
    )
  }

  scope :distrital, -> (state_code, district_code) {
    where([
      'state_code = ? AND district_code = ?', state_code, district_code
      ]
    )
  }

  # scope :followed, -> (user_id) {
  #   where([
  #     'followers.user_id = ?', user_id
  #     ]
  #   )
  # }

end
