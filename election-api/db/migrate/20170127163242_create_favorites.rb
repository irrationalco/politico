class CreateFavorites < ActiveRecord::Migration[5.0]
  def change
    create_table :favorites do |t|

      #Foreign Keys
      t.integer :user_id
      t.integer :projection_id
      
      t.timestamps
    end
  end
end
