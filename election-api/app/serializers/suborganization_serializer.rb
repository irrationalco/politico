class SuborganizationSerializer < ActiveModel::Serializer
  attributes :id, :name, :manager_id, :manager_name, :organization_id, :organization_name

  belongs_to :organization

  def manager_name
    manager = User.find(object.manager_id)
    name = manager.first_name + " " + manager.last_name
    name
  end
end
