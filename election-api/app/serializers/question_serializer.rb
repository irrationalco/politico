class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :position
  has_one :poll
end
