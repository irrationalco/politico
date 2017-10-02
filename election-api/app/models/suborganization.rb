class Suborganization < ApplicationRecord
  has_many :users
  belongs_to :organization
  belongs_to :manager, class_name: 'User', foreign_key: 'manager_id'
end
