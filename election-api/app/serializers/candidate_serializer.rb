class CandidateSerializer < ActiveModel::Serializer
  attributes :id, :name, :photo, :position
  has_one :party
end
