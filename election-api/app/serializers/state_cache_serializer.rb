class StateCacheSerializer < ActiveModel::Serializer
  attributes :id, :state_code, :election_type, :year, :total_votes,
             :PAN, :PCONV, :PES, :PH, :PMC, :PMOR, :PNA, :PPM, :PPM,
             :PRD, :PRI, :PSD, :PSM, :PT, :PVEM
end