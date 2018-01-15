class OrganizationSerializer < ActiveModel::Serializer
  attributes :id, :name, :manager_id, :manager_name

  def manager_name
    manager = object.manager
    manager.present? ? manager.first_name + ' ' + manager.last_name : nil
  end
end
