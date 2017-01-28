class Proyection < ApplicationRecord
  belongs_to :organization
  belongs_to :map
  has_one    :favorite
end
