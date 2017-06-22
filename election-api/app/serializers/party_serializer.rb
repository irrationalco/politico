class PartySerializer < ActiveModel::Serializer
  attributes :id, :name, :image

  has_many :organizations
end
