class Voter < ApplicationRecord
  require 'csv'
  belongs_to :user
  belongs_to :suborganization

  def self.import(file, uid)
    invalidRows = []
    suborg_id = User.find(uid)
    CSV.foreach(file.path, headers: true) do |row|
      begin
        Voter.create! do |v|
          v.user_id = uid
          v.suborganization_id = suborg_id
          
          v.electoral_id_number = row[0].upcase
          v.expiration_date = row[1].to_i
    
          v.first_name = row[2].upcase
          v.first_last_name = row[3].upcase
          v.second_last_name = row[4].upcase
          v.gender = row[5].upcase
          v.date_of_birth = Date.strptime("#{row[6]}/#{row[7]}/#{row[8]}", "%d/%m/%Y")
          v.electoral_code = row[9].upcase
          v.CURP = row[10].upcase
    
          v.section = row[11].upcase
          v.street = row[12].upcase
          v.outside_number = row[13].upcase
          v.inside_number = row[14].upcase
          v.suburb = row[15].upcase
          v.locality_code = row[16].to_i 
          v.locality = row[17].upcase
          v.municipality_code = row[18].to_i
          v.municipality = row[19].upcase
          v.state_code = row[20].to_i
          v.state = row[21].upcase
          v.postal_code = row[22].to_i
          
          v.home_phone = row[23].to_i
          v.mobile_phone = row[24].to_i
          v.email = row[25].upcase
          v.alternative_email = row[26].upcase
          v.facebook_account = row[27].upcase
    
          v.highest_educational_level = row[28].upcase
          v.current_ocupation = row[29].upcase
    
          v.organization = row[30].upcase
          v.party_positions_held = row[31].upcase
          v.is_part_of_party = ActiveModel::Type::Boolean.new.cast row[32].downcase
          v.has_been_candidate = ActiveModel::Type::Boolean.new.cast row[33].downcase
          v.popular_election_position = row[34] 
          v.election_year = row[35].upcase
          v.won_election = ActiveModel::Type::Boolean.new.cast row[36].downcase
          v.election_route = row[37].upcase
          v.notes = row[38].upcase
        end
      rescue
        p $!.message
        invalidRows << row
      end
    end
    if invalidRows.length > 0
        attributes = ['Numero de la credencial de elector', 'Vigencia de la credencial de elector', 'Apellido Paterno',
                       'Apellido Materno', 'Primer Nombre', 'Segundo Nombre', 'Sexo', 'Dia de nacimiento', 'Mes de nacimiento',
                       'Anio de nacimiento','Clave de elector', 'CURP', 'Seccion Electoral', 'Calle', 'Numero exterior', 'Numero Interior',
                       'Colonia', 'Clave de la localidad', 'Clave de municipio', 'Clave de estado', 'Codigo postal', 'Telefono fijo',
                       'Telefono celular', 'Correo Electronico', 'Correo electronico alternativo', 'Cuenta Facebook', 'Ultimo Grado de estudios',
                       'Ocupacion Actual', 'Organizacion a la que pertenece','Cargos partidarios que ha tenido', 'Pertenece a la estructura del partido', 
                       'Ha sido candidata(o)', 'Cargo de eleccion popular', 'Año de eleccion', 'Resulto electa(o)', 'Via de eleccion', 'Notas']
    
        CSV.generate(headers: true) do |csv|
          csv << attributes
    
          invalidRows.each do |row|
            csv << row
          end
      end
    else
      return nil
    end
  end
end
