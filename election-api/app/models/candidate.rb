class Candidate < ApplicationRecord
  belongs_to :party
  has_and_belongs_to_many :sections
end
