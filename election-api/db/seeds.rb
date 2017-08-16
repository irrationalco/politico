# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Monterrey

# for i in 975..1686
#   Projection.create(:state_code => 19, :muni_code => 39, :section_code => i,
#     :PRI => Random.rand(1500), :PAN => Random.rand(1500), :PRD => Random.rand(1000),
#     :Morena => Random.rand(1000), :PV => Random.rand(300), :PT => Random.rand(300), 
#     :MC => Random.rand(300))
# end

require 'csv'

# def delete_dbs(*class_names)
#   class_names.each do |cname|
#     puts "Deleting from table `#{cname}`."
#     cname.send(:delete_all)
#   end
# end

# delete_dbs(State, Municipality,Projection,Poll,Section)

##############################
# Creando estados y municipios
muni_ids = CSV.read("tbl_ids.csv")
muni_ids.shift

muni_ids.each do |row|
  row[1] = "Veracruz de Ignacio de la Llave" if row[1] == "Veracruz"
  row[1] = "Michoacán de Ocampo" if row[1] == "Michoacán"
  row[1] = "Michoacán de Ocampo" if row[1] == "Michoacán"
  row[1] = "Coahuila de Zaragoza" if row[1] == "Coahuila"

  state = State.find_or_create_by(name: row[1]) do |a_state|
    a_state.state_code = row[0]
  end

  muni = Municipality.where(name: row[3]).take
  if muni == nil
    muni = Municipality.create({ name: row[3], muni_code: row[2], state_code: row[0] })
  else
    if muni.state_code != state.state_code
      muni = Municipality.create({ name: row[3], muni_code: row[2], state_code: row[0] })
    else
      muni = nil
    end
  end

  unless muni == nil && state.municipalities.exists?(id: muni.id)
    state.municipalities << muni
  end
end

# tbl_ids.csv schema
#     0            1          2            3
# codigo_edo, nombre_edo, codigo_muni, nombre_muni
#####################################################

##################################
# Cargando datos historicos del INE
# ine_data = CSV.read("tbl_ine.csv")
# ine_data.shift

# ine_data.each do |row|
#   year          = row[0].to_i
#   election_type = row[1]
#   state_code    = row[2].to_i
#   muni_code     = row[4] .to_i
#   district_code = row[6].to_i
#   section_code  = row[7].to_i
#   nominal_list  = row[8].to_i

#   pan    = row[9].to_i
#   pconv  = row[10].to_i
#   pes  = row[12].to_i
#   ph   = row[13].to_i
#   pmc  = row[14].to_i
#   pmor = row[15].to_i
#   pna  = row[16].to_i
#   ppm  = row[17].to_i
#   prd  = row[18].to_i
#   pri  = row[19].to_i
#   psd  = row[20].to_i
#   psm  = row[21].to_i
#   pt   = row[23].to_i
#   pvem = row[24].to_i

#   total = pan + pconv + pes + ph + pmc + pmor + pna + ppm + prd + pri + psd + psm + pt + pvem

#   Projection.create(state_code: state_code, muni_code: muni_code, section_code: section_code, district_code: district_code,
#                     nominal_list: nominal_list, year: year, election_type: election_type, 
#                     PAN: pan, PCONV: pconv, PES: pes, PH: ph, PMC: pmc, PMOR: pmor, PNA: pna, PPM: ppm, PRD: prd,
#                     PRI: pri, PSD: psd, PSM: psm, PT: pt, PVEM: pvem, total_votes: total)
# end

# tbl_ine.csv SCHEMA
#  0      1          2          3          4            5          6            7       8    
# ANO, Eleccion, Id_entidad, Entidad, Id_municipio, Municipio, id_distrito, seccion, nominal,
#
#  9    10      11    12   13  14    15   16   17   18   19   20   21   22   23   24
# PAN, PCONV, PDSPPN, PES, PH, PMC, PMOR, PNA, PPM, PRD, PRI, PSD, PSM, PSN, PT, PVEM
########################################################################################################### 


# Creando algunos polls y sections de prueba para las encuestas
poll = Poll.create(name: "Primer Encuesta", total_sections: 5)
poll2 = Poll.create(name: "Segunda Encuesta", total_sections: 4)

section1 = Section.create(title: "¿Cómo te sientes sobre...?", poll: poll)
section2 = Section.create(title: "¿Si hoy tuvieras que votar por el presidente, qué tan probable sería que eligieras a...?", poll: poll)
section3 = Section.create(title: "¿Si hoy tuvieras que votar por Alcalde de Monterrey, qué tan probable sería que eligieras a...?", poll: poll)
section4 = Section.create(title: "¿Cómo crees que sea su caracter como persona?", poll: poll)
section5 = Section.create(title: "Un poco sobre ti: ", poll: poll)








