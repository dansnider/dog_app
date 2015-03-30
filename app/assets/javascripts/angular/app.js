(function() {
	console.log('loaded app.js')
	var app = angular.module('spiritDog', []);

	app.controller('DogController', [ '$http', function($http){
		var app = this;

		app.dogs = [];
		
		$http.get('/dogs.json').success(function(data){
			app.dogs = data;

			var width = 800;
			var height = 800;

			var padding = 20

			var heightScale = d3.scale.linear()
											.domain([6, 100])
											.range([padding, height - padding]);

			var widthScale = d3.scale.linear()
											.domain([4, 100])
											.range([padding, width - padding]);

			var color = d3.scale.linear()
									.domain([0,184])
									.range(['#3772FF', '#E2EF70'])

			var canvas = d3.select('.canvas') 
									.append('svg')
									.attr('width', width)
									.attr('height', height)
									.attr('class', 'dog-graph');

			// setting up axes
			var xAxis = canvas.append('line')
									.attr('x1', 0)
									.attr('y1', height/2)
									.attr('x2', width)
									.attr('y2', height/2)
									.attr('stroke', 'black')
									.attr('stroke-width', 1);

			var yAxis = canvas.append('line')
									.attr('x1', width/2)
									.attr('y1', 0)
									.attr('x2', width/2)
									.attr('y2', height)
									.attr('stroke', 'black')
									.attr('stroke-width', 1);
			
			// circles representing dogs
			canvas.selectAll('circle')
									.data(app.dogs)
									.enter()
									.append('circle')
										.attr('cx', width/2)
										.attr('cy', height/2)
										.attr('r', 5)
										.attr('fill', function(d) { return color(d.rarity); })
										.attr('class', function(d) { return "dog-" + d.id })
										.attr('class', 'dog-circle')
										.on('click', function(){
											console.log(this.classList[0]);
										})
										.on('mouseover', function(){
											d3.select(this)
												.attr('fill', 'red')
										})
										.on('mouseout', function(){
											d3.select(this)
												.attr('fill', function(d) { return color(d.rarity); })
										});

			canvas.selectAll('circle')
									.data(app.dogs)
									.transition()
									.duration(1000)
									.ease('sin')
									.attr('cx', function(d) { return widthScale(d.size); })
									.attr('cy', function(d) { return (800 - heightScale(d.energy)); });

			// canvas.selectAll('text')
			// 						.data(app.dogs)
			// 						.enter()
			// 						.append('text')
			// 							.text(function(d) { return d.breed })
			// 							.attr('x', function(d) { return widthScale(d.size) + 5;})
			// 							.attr('y', function(d) { return (800 - heightScale(d.energy)) })
			// 							.attr("font-family", "sans-serif")
	  //  								.attr("font-size", "11px")
	  //  								.attr("fill", function(d) { return color(d.rarity) });

	   				
		});
	}]);
})();