# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Monterrey
require 'csv'

CSV.foreach("../secciones_simple.csv") { |row|
  panVotos = Random.rand(1500)
  priVotos = Random.rand(1500)
  prdVotos = Random.rand(300)
  morenaVotos = Random.rand(800)
  pvVotos = Random.rand(50)
  ptVotos = Random.rand(50)
  mcVotos = Random.rand(50)

  total = panVotos + priVotos + prdVotos + morenaVotos + pvVotos + ptVotos + mcVotos;

  Projection.create(:state_code => row[0], :muni_code => row[4], 
                    :section_code => row[2], :district_code => row[1],
                    :PRI => priVotos, :PAN => panVotos, :PRD => prdVotos,
                    :Morena => morenaVotos, :PV => pvVotos, :PT => ptVotos,
                    :MC => mcVotos, :total_votes => total)
}


# for i in 975..1686
#   Projection.create(:state_code => 19, :muni_code => 39, :section_code => i,
#     :PRI => Random.rand(1500), :PAN => Random.rand(1500), :PRD => Random.rand(1000),
#     :Morena => Random.rand(1000), :PV => Random.rand(300), :PT => Random.rand(300), 
#     :MC => Random.rand(300))
# end

# entidad, distrito, seccion, pobtat, muni