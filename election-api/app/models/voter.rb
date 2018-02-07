class Voter < ApplicationRecord
  require 'csv'
  belongs_to :user
  belongs_to :suborganization

  scope :filtered, ->(user, state_code = '', muni = '', section = '', capturist_id = '') {
    res = if user.is_superadmin? || user.is_manager? || user.is_supervisor?
            where(suborganization_id: user.suborganization_id)
          else
            where(user_id: user.id)
          end
    res = res.where(state_code: state_code) unless state_code.empty?
    res = res.where(municipality: muni) unless muni.empty?
    res = res.where(section: section) unless section.empty?
    res = res.where(user_id: capturist_id) unless capturist_id.empty?
    return res
  }
  
end
