class Demographic < ApplicationRecord
  scope :municipal, lambda(state_code, muni_code, year) {
    where([
            'state_code = ? AND muni_code = ?
            AND year = ?', state_code, muni_code, year
          ])
  }

  scope :distrital, lambda(state_code, district_code, year) {
    where([
            'state_code = ? AND district_code = ?
            AND year = ?', state_code, district_code, year
          ])
  }
end
