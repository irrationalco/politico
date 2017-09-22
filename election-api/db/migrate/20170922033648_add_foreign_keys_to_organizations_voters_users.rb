class AddForeignKeysToOrganizationsVotersUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users,        :suborganization_id, :integer
    add_column :voters,       :user_id,            :integer
    add_column :voters,       :suborganization_id, :integer
    add_column :organizations, :manager_id,         :integer
  end
end
