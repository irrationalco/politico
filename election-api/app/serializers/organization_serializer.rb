class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name, :admin_id

  has_many :users
end
