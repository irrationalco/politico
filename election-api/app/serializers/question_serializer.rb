class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :position
  has_one :section
end
