class CreatePeople < ActiveRecord::Migration[5.0]
  def change
    create_table :people do |t|
      t.date :birth_date
      t.string :gender
      t.string :city
      t.string :email
      t.string :phone
      t.string :zip_code
      t.string :electoral_section

      t.timestamps
    end
  end
end
