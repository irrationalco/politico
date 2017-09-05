class ElectoralDatumSerializer < ActiveModel::Serializer
  attributes :id, :electoral_code, :name, :first_last_name, :second_last_name, :date_of_birth, :street, :outside_number, :inside_number, :suburb, :postal_code, :TIMERES, :occupation, :FOL_NAC, :EN_LN, :municipality_name, :state, :district, :municipality, :section, :locality, :apple, :CONS_LC, :EMISIONCRE
end
