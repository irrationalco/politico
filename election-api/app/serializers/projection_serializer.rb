class ProjectionSerializer < ActiveModel::Serializer
  attributes :id, :section_code, :muni_code, :state_code,
             :PRI, :PAN, :PRD, :PMOR, :total_votes
end
