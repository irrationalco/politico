class SectionSerializer < ActiveModel::Serializer
  attributes :id, :title, :position
  has_one :poll
  has_many :questions
  has_many :candidates
end
