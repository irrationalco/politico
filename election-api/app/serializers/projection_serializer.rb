class ProjectionSerializer < ActiveModel::Serializer
  attributes :id, :section_code, :muni_code, :state_code, :district_code,
             :election_type, :year, :nominal_list, :total_votes,
             :PAN, :PCONV, :PES, :PH, :PMC, :PMOR, :PNA, :PPM, :PPM,
             :PRD, :PRI, :PSD, :PSM, :PT, :PVEM
end
