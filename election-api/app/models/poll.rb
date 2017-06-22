class Poll < ApplicationRecord
  belongs_to :organization
  has_many :questions, -> {order(position: :asc)}
end
