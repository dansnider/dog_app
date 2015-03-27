Dog.destroy_all
agent = Mechanize.new

australian_cattle_dog = HTTParty.get('http://www.akc.org/dog-breeds/australian-cattle-dog/')
australian_parsed = Nokogiri::HTML(australian_cattle_dog)

dog_urls = []

australian_parsed.css('.chosen').children.children.children.children.each do |breed|
	dog_urls << (breed.text.gsub(" ", "-").gsub('’', '').gsub('.', '')).downcase
end

dog_urls.slice!(37)
dog_urls.slice!(94)
dog_urls.slice!(196..242)
dog_urls.slice!(55..67)

dog_urls.each do |dog_slug|
	url = HTTParty.get("http://www.akc.org/dog-breeds/" + dog_slug)
	d = Nokogiri::HTML(url)
	Dog.create({
			breed: dog_slug.gsub("-", ' ').gsub(/[A-Za-z']+/,&:capitalize),
			group: d.css('.title').text,
			description: d.css('.adj').text,
			size: d.css('.dot')[0].attributes["style"].value[/\d\w/].to_i,
			energy: 100 - (d.css('.dot')[0].attributes["style"].value.split(';')[1][/\d\w/].to_i),
			rarity: d.css('.bigrank').text.to_i,
			image: d.css('.diagram').children[1].attributes["src"].value
			})
	end


# s3 = Aws::S3::Client.new(
#   region: 'us-east-1',
# )

# resp = s3.create_bucket(
#   acl: "public-read",
#   # required
#   bucket: "DogImages",
#   grant_full_control: "GrantFullControl",
#   grant_read: "GrantRead",
#   grant_read_acp: "GrantReadACP",
#   grant_write: "GrantWrite",
#   grant_write_acp: "GrantWriteACP",
# )


