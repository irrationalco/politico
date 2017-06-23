class Party < ApplicationRecord
  has_many  :organizations
  has_many  :candidates
end
