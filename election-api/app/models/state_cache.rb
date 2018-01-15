class StateCache < ApplicationRecord
  def self.as_projection
    all.map(&:to_projection)
  end

  # rubocop:disable Metrics/MethodLength
  def to_projection
    Projection.new do |r|
      r.PAN = self.PAN
      r.PCONV = self.PCONV
      r.PES = self.PES
      r.PH = self.PH
      r.PMC = self.PMC
      r.PMOR = self.PMOR
      r.PNA = self.PNA
      r.PPM = self.PPM
      r.PRD = self.PRD
      r.PRI = self.PRI
      r.PSD = self.PSD
      r.PSM = self.PSM
      r.PT = self.PT
      r.PVEM = self.PVEM
      r.total_votes = total_votes
      r.state_code = state_code
      r.election_type = election_type
      r.year = year
      r.id = id
    end
  end
  # rubocop:enable Metrics/MethodLength
end
