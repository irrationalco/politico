class ProjectionSerializer < ActiveModel::Serializer
  attributes :id, :section_code, :muni_code, :state_code,
             :PRI, :PAN, :PRD, :Morena
end
