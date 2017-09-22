class AddMoreRolesToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :manager, :boolean, default: false
    add_column :users, :capturist, :boolean, default: false
  end
end