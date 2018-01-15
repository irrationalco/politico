class DemographicSerializer < ActiveModel::Serializer
  attributes :id, :section_code, :muni_code, :state_code, :district_code,
             :total, :year, :hombres, :mujeres, :hijos, :entidad_nac, 
             :entidad_inm, :entidad_mig, :limitacion, :analfabetismo, :educacion_av,
             :pea, :no_serv_salud, :matrimonios, :hogares, :hogares_pob, :auto
end
