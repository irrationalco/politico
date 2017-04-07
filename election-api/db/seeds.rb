# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Monterrey
for i in 975..1686
  puts "creating"
  Projection.create(:state_code => 19, :city_code => 39, :section_code => i,
    :PRI => Random.rand(1500), :PAN => Random.rand(1500), :PRD => Random.rand(1000),
    :Morena => Random.rand(1000), :PV => Random.rand(300), :PT => Random.rand(300), 
    :MC => Random.rand(300))
end