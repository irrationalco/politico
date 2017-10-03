class SuborganizationSerializer < ActiveModel::Serializer
  attributes :id, :name, :manager_id, :manager_name, :organization_id

  belongs_to :organization

  def manager_name
    manager = object.manager
    manager.present? ? manager.first_name + " " +manager.last_name : nil
  end
end
