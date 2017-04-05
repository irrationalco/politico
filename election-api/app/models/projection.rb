class Projection < ApplicationRecord
  belongs_to :organization
  has_one    :favorite
end
