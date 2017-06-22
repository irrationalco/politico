class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name, :admin_id

  has_one :party
  has_many :users
  has_many :polls
  has_many :projections
end
