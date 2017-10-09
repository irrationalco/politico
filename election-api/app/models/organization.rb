class Organization < ApplicationRecord
  has_many    :suborganizations
  belongs_to  :manager, class_name: 'User', foreign_key: 'manager_id'
end
