class AddAdminRoleToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :superadmin, :boolean, default: false
    add_column :users, :supervisor, :boolean, default: false
  end
end