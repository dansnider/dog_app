(function() {
	console.log('loaded app.js')
	var app = angular.module('spiritDog', []);

	app.controller('DogController', [ '$http', function($http){
		var app = this;

		app.dogs = [];
		
		$http.get('/dogs.json').success(function(data) {
			app.dogs = data;
			
			var width = 800,
				  height = 800,
				  padding = 10,
				  radius = 8;

			var x = d3.scale.linear()
			  .range([0, width - 50]);

			var y = d3.scale.linear()
			  .range([height, 10]);

			var xVar = "size",
      		yVar = "energy";
			
			//add attributes to data set
			data.forEach(function(d) {
		    d[xVar] = +d[xVar];
		    d[yVar] = +d[yVar];
		  });

			//initial positions
			data.forEach(function(d) {
		    d.x = x(d[xVar]);
		    d.y = y(d[yVar]);
		    d.radius = radius;
		  });

			var heightScale = d3.scale.linear()
											.domain(d3.extent(data, function(d) { return d[yVar]; })).nice()
											.range([20, 780]);

			var widthScale = d3.scale.linear()
											.domain(d3.extent(data, function(d) { return d[xVar]; })).nice()
											.range([200, 600]);

			var color = d3.scale.linear()
									.domain([0,184])
									.range(['#3772FF', '#E2EF70'])

			var svg = d3.select('.svg') 
									.append('svg')
									.attr('width', width)
									.attr('height', height)
									.attr('class', 'dog-graph');

			// setting up axes
			var xAxis = svg.append('line')
									.attr('x1', 0)
									.attr('y1', height/2)
									.attr('x2', width)
									.attr('y2', height/2)
									.attr('stroke', 'black')
									.attr('stroke-width', 1);

			var yAxis = svg.append('line')
									.attr('x1', width/2)
									.attr('y1', 0)
									.attr('x2', width/2)
									.attr('y2', height)
									.attr('stroke', 'black')
									.attr('stroke-width', 1);
			
			var force = d3.layout.force()
									.nodes(data)
									.size([width, height])
							    .on("tick", tick)
							    .charge(-1)
							    .gravity(0)
							    // .chargeDistance(20);

			x.domain(d3.extent(data, function(d) { return d[xVar]; })).nice();
 		  y.domain(d3.extent(data, function(d) { return d[yVar]; })).nice();

			var node = svg.selectAll('circle')
									.data(app.dogs)
									.enter()
										.append('circle')
										.attr('r', radius)
										.attr('cx', function(d) { return x(d[xVar]); })
										.attr('cy', function(d) { return 800 - y(d[yVar]); })
										.attr('fill', function(d) { return color(d.rarity); })
										.attr('stroke-width', 1)
										.attr('stroke', 'white')
										.call(force.drag);
			
			force.start()
			force.resume()

			function tick(e) {
		    node.each(moveTowardDataPosition(e.alpha));

		    node.each(collide(e.alpha));

		    node.attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });
		  }

		  function moveTowardDataPosition(alpha) {
		    return function(d) {
		      d.x += (x(d[xVar]) - d.x) * 0.1 * alpha;
		      d.y += (y(d[yVar]) - d.y) * 0.1 * alpha;
		    };
		  }

			function collide(alpha) {
		    var quadtree = d3.geom.quadtree(app.dogs);
		    return function(d) {
		      var r = d.radius + radius + padding,
		          nx1 = d.x - r,
		          nx2 = d.x + r,
		          ny1 = d.y - r,
		          ny2 = d.y + r;
		      quadtree.visit(function(quad, x1, y1, x2, y2) {
		        if (quad.point && (quad.point !== d)) {
		          var x = d.x - quad.point.x,
		              y = d.y - quad.point.y,
		              l = Math.sqrt(x * x + y * y),
		              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
		          if (l < r) {
		            l = (l - r) / l * alpha;
		            d.x -= x *= l;
		            d.y -= y *= l;
		            quad.point.x += x;
		            quad.point.y += y;
		          }
		        }
		        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		      });
		    };
		  }



			// circles representing dogs
			// canvas.selectAll('circle')
			// 						.data(app.dogs)
			// 						.enter()
			// 						.append('circle')
			// 							.attr('cx', width/2)
			// 							.attr('cy', height/2)
			// 							.attr('r', 5)
			// 							.attr('fill', function(d) { return color(d.rarity); })
			// 							.attr('class', function(d) { return "dog-" + d.id })
			// 							.attr('class', 'dog-circle')
			// 							.on('click', function(){
			// 								console.log(this.classList[0]);
			// 							})
			// 							.on('mouseover', function(){
			// 								d3.select(this)
			// 									.attr('fill', 'red')
			// 							})
			// 							.on('mouseout', function(){
			// 								d3.select(this)
			// 									.attr('fill', function(d) { return color(d.rarity); })
			// 							});

			// canvas.selectAll('circle')
			// 						.data(app.dogs)
			// 						.transition()
			// 						.duration(1000)
			// 						.ease('sin')
			// 						.attr('cx', function(d) { return widthScale(d.size); })
			// 						.attr('cy', function(d) { return (800 - heightScale(d.energy)); });

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