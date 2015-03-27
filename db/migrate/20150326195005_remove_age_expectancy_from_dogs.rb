class RemoveAgeExpectancyFromDogs < ActiveRecord::Migration
  def change
    remove_column :dogs, :age_expectancy, :integer
  end
end
