class RemoveSecondNameFromVoters < ActiveRecord::Migration[5.0]
  def change
    remove_column :voters, :second_name
  end
end
