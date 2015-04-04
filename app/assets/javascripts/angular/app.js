(function() {
	console.log('loaded app.js')
	var app = angular.module('spiritDog', []);

	app.controller('DogController', [ '$http', '$filter', '$scope', function($http, $scope, $filter){
		var controller = this;

		controller.dogs = [];
		$scope.dogs = [];
		
		$http.get('/dogs.json').success(function(data) {
			controller.dogs = data; 
			$scope.dogs = data;
			 renderD3(data)
		});

		
		$('#search-box').on('submit', function(e){
			e.preventDefault()
			query = $('#query').val()
		});
			
	}]); // app.controller

	function renderD3(data) {

		var width = 800,
				height = 800,
				padding = 10,
				radius = 10;

			//initialize scales
			var x = d3.scale.linear()
			  .range([0, width - 50]);

			var y = d3.scale.linear()
			  .range([height, 10]);

			var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .tickSize(-height);

			var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(5)
		    .tickSize(-width);

			//add attributes to data set
			var xVar = "size",
      		yVar = "energy";
			
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

		  // set domain for scale
			x.domain(d3.extent(data, function(d) { return d[xVar]; })).nice();
 		  y.domain(d3.extent(data, function(d) { return d[yVar]; })).nice();

 		  console.log(d3.extent(data, function(d) { return d[xVar]; }));
 		  console.log(d3.extent(data, function(d) { return d[yVar]; }));
			

			var color = d3.scale.linear()
				.domain([0,184])
				.range(['#3772FF', '#E2EF70'])

			var zoom = d3.behavior.zoom()
				.x(x)
				.y(y)
				.scaleExtent([1, 10])
				.on('zoom', zoomed);

			//reset function
			d3.select("#reset").on("click", reset);

			// canvas creation
			var svg = d3.select('.svg') 
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('class', 'dog-graph')
				.call(zoom)

			svg.append("rect")
		    .attr("width", "100%")
		    .attr("height", "100%")
		    .attr("fill", "#DCDCDD");

			svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);

		  svg.append("g")
		    .attr("class", "y axis")
		    .attr('stroke', '#DCDCDD')
		    .call(yAxis);

			// set force layout
			var force = d3.layout.force()
				.nodes(data)
				.size([width, height])
				.on("tick", tick)
				.charge(-14)
				.gravity(.036)
				// .chargeDistance(20);

			// create dog nodes
			var node = svg.selectAll('circle')
				.data(data)
				.enter()
					.append('circle')
					.attr('r', radius)
					.attr('cx', function(d) { return x(d[xVar]); })
					.attr('cy', function(d) { return 800 - y(d[yVar]); })
					.attr('fill', function(d) { return color(d.rarity); })
					.attr('class', function(d) {return (d.description).toLowerCase().replace(',', '').replace(',', '')  })
					.attr('id', function(d) { return (d.breed).toLowerCase().replace(' ', '-').replace(' ', '-') })
					.attr('stroke-width', 1)
					.attr('stroke', 'white')
					.call(force.drag)
					.on('click', function(d){
						d3.select(this)
						d3.select('#tooltip').remove()
						var xPosition = parseFloat(d3.select(this).attr('cx') + 10)
						var yPosition = parseFloat(d3.select(this).attr('cy'))
						if (this.getBBox().x > (width - 250)) {  //needs an update
							xPosition -= 250;
						} 
						if (this.getBBox().y > (height - 325)) {
							yPosition -=325;
						}	
						  svg.append('rect')	
								.attr('class', 'info-rect')
								.attr('x', xPosition)
	              .attr("y", yPosition)
	              .attr("width", 250)
	              .attr("height", 325)
	              .attr('fill', 'white')
	              .attr('stroke-width', 1)
	              .attr('stroke', 'grey')
	            svg.append('text')
	            	.attr('class', 'div-tooltip')
	            	.attr('x', xPosition + 10)
	            	.attr('y', yPosition + 20)
	            	.attr('font-family', 'sans-serif')
								.attr('font-size', '14px')
								.attr('font-weight', 'bold')
								.text(d.breed);
							svg.append('text')
	            	.attr('class', 'div-tooltip')
	            	.attr('x', xPosition + 10)
	            	.attr('y', yPosition + 40)
	            	.attr('font-family', 'sans-serif')
								.attr('font-size', '12px')
								.attr('font-weight', 'bold')
								.text(d.description);
							svg.append('svg:image')
								.attr('class', 'dog-image')
								.attr('x', xPosition + 1)
								.attr('y', yPosition + 75)
								.attr('width', 248)
								.attr('height', 248)
								.attr('xlink:href', d.image)
							svg.append('text')
								.attr('class', 'close-out')
								.attr('x', xPosition + 233)
								.attr('y', yPosition + 18)
								.attr('font-family', 'sans-serif')
								.attr('font-size', '12px')
								.attr('font-weight', 'bold')
								.text('x');

	              var closeOuts = svg.selectAll('.close-out')
									.on('click', function(){
										d3.selectAll('.info-rect').remove()
										d3.selectAll('.tooltip').remove()
										d3.selectAll('.div-tooltip').remove()
										d3.selectAll('.dog-image').remove()
										d3.selectAll('.close-out').remove()
									});
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
						})
					.on('mouseout', function(){
						d3.select(this)
							.attr('fill', function(d){ return color(this.__data__.rarity) })
							.attr('r', 10)
						d3.select('#tooltip').remove()
					});

			force.start();
			
			function tick(e) {
		    node.each(moveTowardDataPosition(e.alpha));

		    node.each(collide(e.alpha));

		    node.attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });
		  }

		  function zoomed() {
			  svg.select(".x.axis").call(xAxis);
			  svg.select(".y.axis").call(yAxis);
			  force.resume();
			}

			function reset() {
			  d3.transition().duration(750).tween("zoom", function() {
			    var ix = d3.interpolate(x.domain(), [5, 99]),
			        iy = d3.interpolate(y.domain(), [7, 99]);
			    return function(t) {
			      zoom.x(x.domain(ix(t))).y(y.domain(iy(t)));
			      zoomed();
			      force.resume();
			    };
			  });
			}
    
		  function moveTowardDataPosition(alpha) {
		    return function(d) {
		      d.x += (x(d[xVar]) - d.x) * 0.1 * alpha;
		      d.y += (y(d[yVar]) - d.y) * 0.1 * alpha;
		    };
		  }

		  //collision detection
			function collide(alpha) {
		    var quadtree = d3.geom.quadtree(data);
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

		  // set global variables for user selections
		  $('.living-options').children().click(function(index){
		  	getDwelling(this.id)
		  	$('html, body').animate({
			    scrollTop: $('#lifestyle').offset().top
		    }, 500);
	  	  return false;
			});

		  $('.lifestyle-options').children().click(function(index){
		  	getLifestyle(this.id)
		  	$('html, body').animate({
			    scrollTop: $('#dog-graph').offset().top
		    }, 500);
	  	  return false;
			});
		 	
		 	//scroll animations
		  $('a').click(function(){
			  $('html, body').animate({
			    scrollTop: $( $.attr(this, 'href') ).offset().top
		    }, 500);
	  	  return false;
			});

			function zoomGraphX(xDom) {
			  d3.transition().duration(750).tween("zoom", function() {
			    var ix = d3.interpolate(x.domain(), xDom);
			    return function(t) {
			      zoom.x(x.domain(ix(t)));
			      zoomed();
			      force.resume();
			    };
			  });
			}

		  function zoomGraphY(yDom) {
			  d3.transition().duration(750).tween("zoom", function() {
			    var iy = d3.interpolate(y.domain(), yDom);
			    return function(t) {
			      zoom.y(y.domain(iy(t)));
			      zoomed();
			      force.resume();
			    };
			  });
			}

			//on scroll to a certain point.
			function getDwelling(dwelling){
				switch(dwelling){
					case "city": 
						xDom = [5, 48];
						zoomGraphX(xDom);
						break;
					case "suburb": 
						xDom = [40, 75];
						zoomGraphX(xDom);
						break;
					case "rural": 
						xDom = [50, 100];
						zoomGraphX(xDom);
						break;
				}
			}

			function getLifestyle(lifestyle){
				switch(lifestyle){
					case "couch": 
						yDom = [5, 48];
						zoomGraphY(yDom)
						break;
					case "walk": 
						yDom = [30, 60];
						zoomGraphY(yDom);
						break;
					case "hike": 
						yDom = [70, 100];
						zoomGraphY(yDom);
						break;
				}
			}

			function getSearchResults(query){
				reset()
				d3.selectAll('.' + query)
					.attr('fill', 'purple')
					.attr('r', 15);
				d3.selectAll('#' + query.replace(' ', '-').replace(' ', '-'))
					.attr('fill', 'purple')
					.attr('r', 15);
			}

		}
})();