class Dog < ActiveRecord::Base

	def get_all_dog_images
		d = Dog.all
		d.each do |dog|
			Net::HTTP.start("s3-us-west-2.amazonaws.com") do |http|
				uri = URI::parse(dog.image)
				split = uri.path.split('/')
	  		resp = http.get("/americankennelclub/" + split[2])
	  		open(dog.breed.gsub(" ", "-")+ ".jpg", "wb") do |file|
	    		file.write(resp.body)
	   		end
			end
		end
	end

end
