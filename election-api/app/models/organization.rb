class Organization < ApplicationRecord
  has_many :users
  has_many :projections
  belongs_to :party
end
