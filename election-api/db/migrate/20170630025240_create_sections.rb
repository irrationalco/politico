class CreateSections < ActiveRecord::Migration[5.0]
  def change
    create_table :sections do |t|
      t.string :title
      t.timestamps

      # Foreign keys
      t.integer :poll_id
    end
  end
end
