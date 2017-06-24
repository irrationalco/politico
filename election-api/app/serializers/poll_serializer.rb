class PollSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :sections
end
