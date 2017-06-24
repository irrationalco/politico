class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :position, :type, :parameters
  has_one :section
end
