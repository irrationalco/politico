class ChangeDemographicsEntidadColumns < ActiveRecord::Migration[5.0]
  def change
    rename_column :demographics, :entidad_ant, :entidad_inm
    add_column    :demographics, :entidad_mig, :float
    add_column    :demographics, :mujeres,     :float
  end
end