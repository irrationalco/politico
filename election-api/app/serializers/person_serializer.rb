class PersonSerializer < ActiveModel::Serializer
  attributes :id, :birth_date, :gender, :city, :email, :phone, :zip_code, :electoral_section
end
