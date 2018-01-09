class CreateDemographics < ActiveRecord::Migration[5.0]
  def change
    create_table :demographics do |t|

      t.integer :section_code
      t.integer :muni_code
      t.integer :state_code
      t.integer :district_code
      t.integer :total
      t.float   :hombres
      t.float   :hijos
      t.float   :entidad_nac
      t.float   :entidad_ant
      t.float   :limitacion
      t.float   :analfabetismo
      t.float   :educacion_av
      t.float   :pea
      t.float   :no_serv_salud
      t.float   :matrimonios
      t.float   :hogares
      t.float   :hogares_jefa
      t.float   :hogares_pob
      t.float   :auto

      t.timestamps
    end
  end
end
