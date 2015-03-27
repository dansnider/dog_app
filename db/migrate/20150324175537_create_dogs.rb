class CreateDogs < ActiveRecord::Migration
  def change
    create_table :dogs do |t|
      t.string :breed
      t.string :group
      t.text :description
      t.integer :size
      t.integer :energy
      t.integer :rarity
      t.string :image
      t.boolean :good_with_kids
      t.boolean :good_with_other_animals
      t.integer :age_expectancy

      t.timestamps null: false
    end
  end
end
