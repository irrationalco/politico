class Organization < ApplicationRecord
  has_many :users
  has_many :projections
  has_many :polls
  belongs_to :party
end
