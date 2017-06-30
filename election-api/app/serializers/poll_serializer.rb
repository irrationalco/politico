class PollSerializer < ActiveModel::Serializer
  attributes :id, :name, :total_sections

  has_many :sections
end
