class CreatePeople < ActiveRecord::Migration[5.0]
  def change
    create_table :people do |t|
      t.date :birthDate
      t.string :gender
      t.string :city
      t.string :email
      t.string :phone
      t.string :postalCode
      t.string :electoralSection

      t.timestamps
    end
  end
end
