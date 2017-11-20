class RenameCurpToCurp < ActiveRecord::Migration[5.0]
  def change
    rename_column :voters, :CURP, :curp
  end
end
