# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Monterrey
require 'csv'

# poll = Poll.create(name: "Primer Encuesta", total_sections: 5)
# poll2 = Poll.create(name: "Segunda Encuesta", total_sections: 4)

# section1 = Section.create(title: "¿Cómo te sientes sobre...?", poll: poll)
# section2 = Section.create(title: "¿Si hoy tuvieras que votar por el presidente, qué tan probable sería que eligieras a...?", poll: poll)
# section3 = Section.create(title: "¿Si hoy tuvieras que votar por Alcalde de Monterrey, qué tan probable sería que eligieras a...?", poll: poll)
# section4 = Section.create(title: "¿Cómo crees que sea su caracter como persona?", poll: poll)
# section5 = Section.create(title: "Un poco sobre ti: ", poll: poll)



# for i in 975..1686
#   Projection.create(:state_code => 19, :muni_code => 39, :section_code => i,
#     :PRI => Random.rand(1500), :PAN => Random.rand(1500), :PRD => Random.rand(1000),
#     :Morena => Random.rand(1000), :PV => Random.rand(300), :PT => Random.rand(300), 
#     :MC => Random.rand(300))
# end

CSV.foreach("tbl_ine.csv") do |row|
  state_code    = row[2]
  muni_code     = row[4] 
  section_code  = row[8]
  district_code = row[7]
  nominal_list  = row[9]
  year          = row[0]
  election_type = row[1]

  pan    = row[10]
  pconv  = row[11]
  pdsppn = row[12]
  pes  = row[13]
  ph   = row[14]
  pmc  = row[15]
  pmor = row[16]
  pna  = row[17]
  ppm  = row[18]
  prd  = row[19]
  pri  = row[20]
  psd  = row[21]
  psm  = row[22]
  psn  = row[23]
  pt   = row[24]
  pvem = row[25]

  total = pan + pconv + pdsppn + pes + ph + pmc + pmor + pna + ppm + prd + pri + psd + psm + psn + pt + pvem

  Projection.create(state_code: state_code, muni_code: muni_code, section_code: section_code, district_code: district_code,
                    nominal_list: nominal_list, year: year, election_type: election_type, 
                    PAN: pan, PCONV: pconv, PDSPPN: pdsppn, PES: pes, PH: ph, PMC: pmc, PMOR: pmor, PNA: pna, PPM: ppm, PRD: prd,
                    PRI: pri, PSD: psd, PSM: psm, PSN: psn, PT: pt, PVEM: pvem, total_votes: total)
end

# entidad, distrito, seccion, pobtat, muni


# tbl_ine.csv SCHEMA
#  0      1          2          3          4            5          6            7          8       9
# ANO, Eleccion, Id_entidad, Entidad, Id_municipio, Municipio, Municipio, id_distrito, seccion, nominal,

# 10    11      12    13   14  15    16   17   18   19   20   21   22   23   24   25
# PAN, PCONV, PDSPPN, PES, PH, PMC, PMOR, PNA, PPM, PRD, PRI, PSD, PSM, PSN, PT, PVEM 






