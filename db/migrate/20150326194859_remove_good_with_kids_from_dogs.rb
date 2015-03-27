class RemoveGoodWithKidsFromDogs < ActiveRecord::Migration
  def change
    remove_column :dogs, :good_with_kids, :boolean
  end
end
