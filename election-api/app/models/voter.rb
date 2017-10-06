class Voter < ApplicationRecord
  require 'csv'
  belongs_to :user
  belongs_to :suborganization

  def self.import(file, uid)
    invalidRows = []
    CSV.foreach(file.path, headers: true) do |row|
      begin
        Voter.create! do |v|
          # v.captured_by = row[0].upcase
          v.user_id = uid
          
          v.electoral_id_number = row[1].upcase
          v.expiration_date = row[2].to_i
    
          v.first_name = row[3].upcase
          v.second_name = row[4].upcase
          v.first_last_name = row[5].upcase
          v.second_last_name = row[6].upcase
          v.gender = row[7].upcase
          v.date_of_birth = Date.strptime(row[8] , "%d/%m/%Y")
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
        attributes = ['Caputrado por',	'Numero de la credencial de elector',	
        'Vigencia de la credencial de elector', 'Apellido Paterno',	'Apellido Materno',	
        'Primer Nombre',	'Segundo Nombre',	'Sexo',	'Fecha de nacimiento',	'Clave de elector',	
        'CURP',	'Seccion Electoral',	'Calle',	'Numero exterior',	'Numero Interior',	'Colonia',	
        'Clave de la localidad',	'Localidad',	'Clave de municipio',	'Municipio',	'Clave de estado',	
        'Estado',	'Codigo postal',	'Telefono fijo',	'Telefono celular',	'Correo Electronico',	
        'Correo electronico alternativo',	'Cuenta Facebook',	'Ultimo Grado de estudios',	
        'Ocupacion actual',	'Organizacion a la que pertenece',	'Cargos partidarios que ha tenido',	
        'Pertenece a la estructura del partido',	'Ha sido candidato(a)', 'Cargo de eleccion popular',	
        'Ano de eleccion',	'Resulto electa(o)',	'Via de eleccion', 'Notas']
    
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
