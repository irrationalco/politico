# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Monterrey
require 'csv'

poll = Poll.create(name: "Primer Encuesta", total_sections: 5)
poll2 = Poll.create(name: "Segunda Encuesta", total_sections: 4)

section1 = Section.create(title: "¿Cómo te sientes sobre...?", poll: poll)
section2 = Section.create(title: "¿Si hoy tuvieras que votar por el presidente, qué tan probable sería que eligieras a...?", poll: poll)
section3 = Section.create(title: "¿Si hoy tuvieras que votar por Alcalde de Monterrey, qué tan probable sería que eligieras a...?", poll: poll)
section4 = Section.create(title: "¿Cómo crees que sea su caracter como persona?", poll: poll)
section5 = Section.create(title: "Un poco sobre ti: ", poll: poll)



# for i in 975..1686
#   Projection.create(:state_code => 19, :muni_code => 39, :section_code => i,
#     :PRI => Random.rand(1500), :PAN => Random.rand(1500), :PRD => Random.rand(1000),
#     :Morena => Random.rand(1000), :PV => Random.rand(300), :PT => Random.rand(300), 
#     :MC => Random.rand(300))
# end

# entidad, distrito, seccion, pobtat, muni