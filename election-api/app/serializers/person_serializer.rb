class PersonSerializer < ActiveModel::Serializer
  attributes :id, :birthDate, :gender, :city, :email, :phone, :postalCode, :electoralSection
end
