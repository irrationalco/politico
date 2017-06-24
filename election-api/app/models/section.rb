class Section < ApplicationRecord
  belongs_to :poll
  has_and_belongs_to_many :candidates
  has_many :questions, -> {order(position: :asc)}
end
