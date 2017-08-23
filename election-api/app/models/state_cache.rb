class StateCache < ApplicationRecord

  def to_projection
    p self.PAN
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
      r.total_votes = self.total_votes
      r.state_code = self.state_code
      r.election_type = self.election_type
      r.year = self.year
      r.id = self.id
    end
  end

end
