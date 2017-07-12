class State < ApplicationRecord
  class DataNotFound < StandardError; end

  has_many :municipalities

  def self.find_state_by_name(state_name)
    State.where(name: state_name).take!
  rescue ActiveRecord::RecordNotFound
    raise DataNotFound, "Couldn't find a state with that name"
  end

  def find_state_municipality(muni_name)
    self.municipalities.where(name: muni_name).take!
  rescue ActiveRecord::RecordNotFound
    raise DataNotFound, "Couldn't find a municipality with that name in state: #{state.name}"
  end
end