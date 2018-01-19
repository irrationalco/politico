class Voter < ApplicationRecord
  require 'csv'
  belongs_to :user
  belongs_to :suborganization

  scope :filtered, -> (user_id, state_code, muni, section) {
    res = where(user_id: user_id)
    if !state_code.empty?
      res = res.where(state_code: state_code)
    end
    if !muni.empty?
      res = res.where(municipality: muni)
    end
    if !section.empty?
      res = res.where(section: section)
    end
    return res
  }

  # Method to import voters from a CSV file
  def self.import(file, uid)
    invalid_rows = []
    suborg_id = User.find(uid)
    CSV.foreach(file.path, headers: true) do |row|
      begin
        Voter.create! do |v|
          v.user_id = uid
          v.suborganization_id = suborg_id

          v.electoral_id_number = row[0].strip.upcase
          v.expiration_date = row[1].strip.to_i

          v.first_name = row[2].strip.upcase
          v.first_last_name = row[3].strip.upcase
          v.second_last_name = row[4].strip.upcase
          v.gender = row[5].strip.upcase
          v.date_of_birth = Date.strptime("#{row[6].strip}/#{row[7].strip}/#{row[8].strip}", '%d/%m/%Y')
          v.electoral_code = row[9].strip.upcase
          v.curp = row[10].strip.upcase

          v.section = row[11].strip.upcase
          v.street = row[12].strip.upcase
          v.outside_number = row[13].strip.upcase
          v.inside_number = row[14].strip.upcase
          v.suburb = row[15].strip.upcase
          v.locality_code = row[16].strip.to_i
          v.locality = row[17].strip.upcase
          v.municipality_code = row[18].strip.to_i
          v.municipality = row[19].strip.upcase
          v.state_code = row[20].strip.to_i
          v.state = row[21].strip.upcase
          v.postal_code = row[22].strip.to_i

          v.home_phone = row[23].strip.to_i
          v.mobile_phone = row[24].strip.to_i
          v.email = row[25].strip.upcase
          v.alternative_email = row[26].strip.upcase
          v.facebook_account = row[27].strip.upcase

          v.highest_educational_level = row[28].strip.upcase
          v.current_ocupation = row[29].strip.upcase

          v.organization = row[30].strip.upcase
          v.party_positions_held = row[31].strip.upcase
          v.is_part_of_party = !(row[32].strip.downcase =~ /^(si|s)$/).nil?
          v.has_been_candidate = !(row[33].strip.downcase =~ /^(si|s)$/).nil?
          v.popular_election_position = row[34]
          v.election_year = row[35].strip.upcase
          v.won_election = !(row[36].strip.downcase =~ /^(si|s)$/).nil?
          v.election_route = row[37].strip.upcase
          v.notes = row[38].strip.upcase
        end
      rescue StandardError
        p $ERROR_INFO.message
        invalid_rows << row
      end
    end
    return nil if invalid_rows.empty? # Guard clause
    attributes = ['Numero de la credencial de elector', 'Vigencia de la credencial de elector', 'Nombre',
                  'Apellido Paterno', 'Apellido Materno', 'Sexo', 'Dia de nacimiento', 'Mes de nacimiento',
                  'Anio de nacimiento', 'Clave de elector', 'curp', 'Seccion Electoral', 'Calle', 'Numero exterior',
                  'Numero Interior', 'Colonia', 'Clave de la localidad', 'Localidad', 'Clave de municipio', 'Municipio',
                  'Clave de estado', 'Estado', 'Codigo postal', 'Telefono fijo', 'Telefono celular',
                  'Correo Electronico', 'Correo electronico alternativo', 'Cuenta Facebook', 'Ultimo Grado de estudios',
                  'Ocupacion Actual', 'Organizacion a la que pertenece', 'Cargos partidarios que ha tenido',
                  'Pertenece a la estructura del partido', 'Ha sido candidata(o)', 'Cargo de eleccion popular',
                  'Año de eleccion', 'Resulto electa(o)', 'Via de eleccion', 'Notas']

    CSV.generate(headers: true) do |csv|
      csv << attributes

      invalid_rows.each do |row|
        csv << row
      end
    end
  end
end
