class RemoveGoodWithOtherAnimalsFromDogs < ActiveRecord::Migration
  def change
    remove_column :dogs, :good_with_other_animals, :boolean
  end
end
