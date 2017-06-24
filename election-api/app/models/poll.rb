class Poll < ApplicationRecord
  belongs_to :organization
  has_many :sections, -> {order(position: :asc)}
end
