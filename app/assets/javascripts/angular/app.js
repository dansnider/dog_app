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
				.range([300, 500]);

			var widthScale = d3.scale.linear()
				.domain(d3.extent(data, function(d) { return d[xVar]; })).nice()
				.range([300, 500]);

			var color = d3.scale.linear()
				.domain([0,184])
				.range(['#3772FF', '#E2EF70'])

			var svg = d3.select('.svg') 
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('class', 'dog-graph');
			
			var force = d3.layout.force()
				.nodes(data)
				.size([width, height])
				.on("tick", tick)
				.charge(-14)
				.gravity(.02)
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
					.attr('class', function(d) { return d.breed })
					.attr('class', 'dog-circle')
					.attr('stroke-width', 1)
					.attr('stroke', 'white')
					.on('click', function(d){
							console.log(this);
						})
					.on('mouseover', function(d){
						d3.select(this)
							.attr('fill', 'coral')
						var xPosition = parseFloat(d3.select(this).attr('cx') + 10)
						var yPosition = parseFloat(d3.select(this).attr('cy'))
						svg.append('text')
							.attr('id', 'tooltip')
							.attr('x', xPosition)
							.attr('y', yPosition -9)
							.attr('text-anchor', 'middle')
							.attr('font-family', 'sans-serif')
							.attr('font-size', '11px')
							.attr('font-weight', 'bold')
							.text(d.breed);
						// .attr('fill', 'red')
						// .append('text')
						// .text(this.__data__.breed)
						// .attr('x', this.attributes.cx.textContent )
						// .attr('y', this.attributes.cy.textContent )
						// .attr("font-size", "11px")
						// .attr("fill", 'black');
					})
					.on('mouseout', function(){
						d3.select(this)
							.attr('fill', function(d){ return color(this.__data__.rarity) })
						d3.select('#tooltip').remove().transition();
					});
			
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

		});
	}]);
})();