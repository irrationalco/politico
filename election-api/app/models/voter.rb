class Voter < ApplicationRecord
  belongs_to :user
  belongs_to :suborganization
end
