function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	Promise.all([d3.json("song_mini_viz/jb1.json"), d3.json("song_mini_viz/jb2.json") , d3.json("song_mini_viz/jb3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis1", files).redraw();
		   });
	
	Promise.all([d3.json("song_mini_viz/e1.json"), d3.json("song_mini_viz/e2.json"), d3.json("song_mini_viz/e3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis2", files).redraw();
		   });
	
	Promise.all([d3.json("song_mini_viz/e4.json"), d3.json("song_mini_viz/e5.json"), d3.json("song_mini_viz/e6.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis2-2", files).redraw();
		   });
	
	Promise.all([d3.json("song_mini_viz/mo1.json"), d3.json("song_mini_viz/mo2.json"), d3.json("song_mini_viz/mo3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis3", files).redraw();
		   });
	
	Promise.all([d3.json("song_mini_viz/br1.json"), d3.json("song_mini_viz/br2.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis4", files).redraw();
		   });
	
	Promise.all([d3.json("song_mini_viz/br3.json"), d3.json("song_mini_viz/br4.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis4-2", files).redraw();
		   });
	
	Promise.all([d3.json("song_mini_viz/bes1.json"), d3.json("song_mini_viz/bes2.json"), d3.json("song_mini_viz/bes3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis5", files).redraw();
		   });
		   
	Promise.all([d3.json("song_mini_viz/con1.json"), d3.json("song_mini_viz/con2.json"), d3.json("song_mini_viz/con3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis6", files).redraw();
		   });		   
	
	Promise.all([d3.json("song_mini_viz/njs1.json"), d3.json("song_mini_viz/njs2.json"), d3.json("song_mini_viz/njs3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis7", files).redraw();
		   });
		   
	Promise.all([d3.json("song_mini_viz/alt1.json"), d3.json("song_mini_viz/alt2.json"), d3.json("song_mini_viz/alt3.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis8", files).redraw();
		   });
		   
	Promise.all([d3.json("song_mini_viz/no1.json"), d3.json("song_mini_viz/no2.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis9", files).redraw();
		   });
		   
	Promise.all([d3.json("song_mini_viz/con4.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis10", files).redraw();
		   });
		   
	Promise.all([d3.json("song_mini_viz/njs4.json")])
	       .then(function(files) {
			   new SmallVis1("card-vis11", files).redraw();
		   });
		   
	// ==================================================
	
	Promise.all([d3.json("alb_compare/alb_cont3.json"), d3.json("alb_compare/alb_or1.json")])
		   .then(function(files) {
			   new SmallVis2("alb-vis1", files[0], files[1]).redraw(0);
		   });
		   
	Promise.all([d3.json("alb_compare/alb_jump1.json"), d3.json("alb_compare/alb_bes2.json")])
		   .then(function(files) {
			   new SmallVis2("alb-vis2", files[0], files[1]).redraw(1);
		   });
		   
	Promise.all([d3.json("alb_compare/alb_cont1.json"), d3.json("alb_compare/alb_alt2.json")])
		   .then(function(files) {
			   new SmallVis2("alb-vis3", files[0], files[1]).redraw(2);
		   });
		   
	Promise.all([d3.json("alb_compare/alb_njs1.json"), d3.json("alb_compare/alb_alt3.json")])
		   .then(function(files) {
			   new SmallVis2("alb-vis4", files[0], files[1]).redraw(3);
		   });
});


	
function f(x, length) {
	if (length == 3) {
		return 136 * x + 5;
	} else if (length == 2) {
		return 136 * x + 5 + 68;
	} else {
		return 136;
	}
}

class SmallVis1 {
	constructor(id, data) {
		this.svg = d3.select("svg#" + id);
		this.data = data;
		this.xScale = d3.scaleLinear().domain([0, this.data.length]).range([0, 300]);
		this.yScale = d3.scaleLinear().domain([0, 1]).range([0, 100]);
		this.audio = undefined;
		this.playing = false;
		this.audioOriginI = undefined;
		this.audioOriginElem = undefined;
	}
	
	redraw() {
		var gs = this.svg.selectAll("g")
						.data(this.data)
						.enter()
						.append("g")
						.each(this.addPlayerHandler());	
						
		gs.filter(d => d.preview != undefined)
		  .attr("class", "pointer");
		  		
		gs.append("circle")
		  .attr("cx", (d, i) => f(i, this.data.length))
		  .attr("cy", this.yScale(0.5))
		  .attr("r", 5)
		  .attr("class", d => d.genre)
		  .each(this.drawBaseCardWrapper());
		 
		gs.filter(d => d.preview != undefined)
		  .append("image")
		  .attr("height", 6)
		  .attr("width", 6)
		  .attr("x", (d, i) => f(i, this.data.length) - 3)
		  .attr("y", this.yScale(0.5) - 3)
		  .attr("xlink:href", "play.png")
		  .attr("class", "play pointer");
	}
	
	drawBaseCardWrapper() {
		return (d, i) => this.drawBaseCard(d, i);
	}
	
	drawBaseCard(d, i) {
		var cardX = f(i, this.data.length) + 13;
		var cardY = 10;
		this.svg.append("rect")
		        .attr("class", "base-card")
				.attr("x", cardX)
				.attr("y", cardY);
		 
		this.svg.append("text")
				.attr("class", "band-name")
				.attr("x", cardX + 5)
				.attr("y", cardY + 62)
				.text(d.artists)
				.call(cut, 50);
		 
		this.svg.append("text")
				.attr("class", "song-name")
				.attr("x", cardX + 5)
				.attr("y", cardY + 74)
				.text(d.name)
				.call(cut, 50);
		 
		this.svg.append("image")
				.attr("class", "cover-img")
				.attr("x", cardX + 5)
				.attr("y", cardY + 5)
				.attr("xlink:href", d.cover);	
	}
	
	addPlayerHandler() {
		var context = this;
		return function (d, i) { context.addPlayer(d, i, this) };
	}
	
	addPlayer(d, i, elem) {
		var gp = d3.select(elem)
		  .on("click", () => {
			  if (this.audio == undefined || this.audioOriginI != i) { // If no audio exists at the moment
				  if (d.preview != "") {					  
					  if (this.audio != undefined) {
						  d3.select(this.audioOriginElem)
							.select("image")
							.attr("xlink:href", "play.png");	
						  this.audio.pause();
						  this.playing = false;
					  }
					  
					  this.audio = new Audio(d.preview);
					  this.audio.play();
					  this.audioOriginI = i;
					  this.audioOriginElem = elem;
					  this.playing = true;
					  gp.select("image")
					    .attr("xlink:href", "pause.png");
						 
					  this.audio.onended = () => {
					      this.audio = undefined;
						  this.audioOriginI = undefined;
						  this.playing = false;
						  this.audioOriginElem = undefined;
						  gp.select("image")
						    .attr("xlink:href", "play.png");
					  };
				  }
			  } else {		
				  if (this.audioOriginI == i) {
					  if (this.playing) { // If the audio is playing
						  this.audio.pause();
						  this.playing = false;
						  gp.select("image")
							.attr("xlilnk:href", "play.png");
					  } else { // If the audio is on pause
						  this.audio.play();
						  this.playing = true;
						  gp.select("image")
							.attr("xlilnk:href", "pause.png");
					  }
				  }
			  }
		  });
	}
}

class SmallVis2 {
	constructor(id, album1, album2) {
		this.svg = d3.select("svg#" + id);
		this.album1 = album1;
		this.album2 = album2;
		
		this.smallRadius = 40;
		this.bigRadius = 100;
		this.maxIndex = 8;
	}
	
	redraw(number) {			
		var defs = this.svg.append("defs")
		
		defs.selectAll("pattern")
			.data([this.album1.cover, this.album2.cover])
			.enter()
			.append("pattern")
			.attr("id", (d, i) => "cover" + (2 * number + (i + 1)))
			.attr("width", 80)
			.attr("height", 80)
			.attr("x", -40)
			.attr("y", -40)
			.attr("patternUnits", "userSpaceOnUse")
			.append("image")
			.attr("xlink:href", d => d)
			.attr("height", 80)
			.attr("width", 80);
			
		defs.append("pattern")
			.attr("id", "big-vinyl")
			.attr("width", 200)
			.attr("height", 200)
			.attr("x", -100)
			.attr("y", -100)
			.attr("patternUnits", "userSpaceOnUse")
			.append("image")
			.attr("xlink:href", "big-vinyl.png")
			.attr("height", 200)
			.attr("width", 200);
			
		this.svg.append("circle")
				.attr("cx", 0)
				.attr("cy", 0)
				.attr("r", this.bigRadius)
				.attr("fill", "url(#big-vinyl)");
		
		for (var i = 0; i < FEATURES.length; i++) {
			var coord0 = this.toRadialCoordinates(i, 0, FEATURES.length);
			var coord1 = this.toRadialCoordinates(i, 1, FEATURES.length);
			this.svg.append("line")
					.attr("x1", coord0[0])
					.attr("y1", coord0[1])
					.attr("x2", coord1[0])
					.attr("y2", coord1[1])
					.attr("stroke-width", 1)
					.attr("stroke", "black")
					.attr("stroke-dasharray", ("3, 3"));
		}
				
		this.svg.append("path")
			.attr("d", () => {
				var arc = d3.arc()
							.innerRadius(0)
							.outerRadius(this.smallRadius)
							.startAngle(-Math.PI * 0.75)
							.endAngle(Math.PI * 0.25)()
							
				return arc.substring(0, arc.length - 5);
			})
			.attr("fill", "url(#cover" + (2 * number + 1) + ")")
			.attr("class", "stroke " + this.album1.genre)
			.on("mouseover", this.focusOnAlbumHandler(1))
			.on("mouseout", this.defocusOfAlbumHandler(1));
						
		this.svg.append("path")
			.attr("d", () => {
				var arc = d3.arc()
							.innerRadius(0)
							.outerRadius(this.smallRadius)
							.startAngle(Math.PI * 0.25)
							.endAngle(Math.PI * 1.25)()
							
				return arc.substring(0, arc.length - 5);
			})
			.attr("fill", "url(#cover" + (2 * number + 2) + ")")
			.attr("class", "stroke " + this.album2.genre)
			.on("mouseover", this.focusOnAlbumHandler(2))
			.on("mouseout", this.defocusOfAlbumHandler(2));
				
		this.svg.selectAll("text")
				.data(FEATURES)
				.enter()
				.append("text")
				.text(d => d)
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "middle")
				.attr("font-size", 7)
				.attr("transform", (d, i) => {
					var coord = this.toRadialCoordinates(i, 1.1, FEATURES.length);
					var tx = coord[0];
					var ty = coord[1];
					
					var rotation = 360 * i / FEATURES.length;
					if (rotation > 90 && rotation < 270) {
						rotation = rotation - 180
					}
					return "translate(" + tx + "," + ty + ") rotate(" + rotation + ")";
				});
				
		var coordsAlbum1 = [];
		var coordsAlbum2 = [];
				
		for (var i = 0; i < FEATURES.length; i++) {
			var coord1 = this.toRadialCoordinates(i, this.album1[FEATURES[i]], FEATURES.length);			
			coordsAlbum1.push(coord1);
				
			this.svg.append("circle")
					.attr("cx", coord1[0])
					.attr("cy", coord1[1])
					.attr("r", 2)
					.attr("class", this.album1.genre)
					.on("mouseover", this.turnOnFeatureLabelHandler(1, i))
					.on("mouseout", () => this.turnOffFeatureLabel());
		}
				
		this.svg.append("polygon")
				.attr("points", coordsAlbum1.map(xy => xy.join(",")).join(" "))
				.attr("class", "stroke " + this.album1.genre)
				.attr("stroke-width", 1)
				.attr("fill", "none");
								
		for (var i = 0; i < FEATURES.length; i++) {	
			var coord2 = this.toRadialCoordinates(i, this.album2[FEATURES[i]], FEATURES.length);	
			coordsAlbum2.push(coord2);
					
			this.svg.append("circle")
					.attr("cx", coord2[0])
					.attr("cy", coord2[1])
					.attr("r", 2)
					.attr("class", this.album2.genre)
					.on("mouseover", this.turnOnFeatureLabelHandler(2, i))
					.on("mouseout", () => this.turnOffFeatureLabel());
		}
				
		this.svg.append("polygon")
				.attr("points", coordsAlbum2.map(xy => xy.join(",")).join(" "))
				.attr("class", "stroke " + this.album2.genre)
				.attr("stroke-width", 1)
				.attr("fill", "none");
	}
	
	focusOnAlbumHandler(id) {
		var context = this;
		return function(d, i) { context.focusOnAlbum(id, this, context) };
	}
	
	focusOnAlbum(id, elem) {	
		var otherId = 3 - id;
		
		d3.select(elem)
		  .attr("d", d3.arc()
					   .innerRadius(0)
					   .outerRadius(this.smallRadius)
					   .startAngle(-Math.PI)
					   .endAngle(Math.PI)
		  )
		  .moveToFront();
		  
		var genre = this["album" + id].genre;
		var otherGenre = this["album" + otherId].genre;
		
		this.svg.select("polygon." + genre).moveToFront();
		this.svg.selectAll("circle." + genre).moveToFront();
		
		this.svg.select("polygon." + otherGenre)
				.attr("stroke-opacity", 0.2);				
		this.svg.selectAll("circle." + otherGenre)
				.attr("opacity", 0.2);
				
		for (var i = 0; i < FEATURES.length; i++) {
			this.turnOnFeatureLabel(id, i);		
		}
				
		var text = this.svg.append("text")
						   .attr("class", "album-info")
						   .attr("x", 0)
						   .attr("y", 0)
						   .attr("alignment-baseline", "after-edge")
						   .text(this["album" + id].artists)
						  
		var textBbox = text.node().getBBox();
		
		this.svg.append("rect")
				.attr("x", textBbox.x - 2)
				.attr("y", textBbox.y - 2)
				.attr("height", textBbox.height + 4)
				.attr("width", textBbox.width + 4)
				.attr("class", "album-info")
				.attr("fill", "#222");
				
		text.moveToFront();		
		
		text = this.svg.append("text")
					   .attr("class", "album-info")
					   .attr("x", 0)
					   .attr("y", 0)
					   .attr("alignment-baseline", "before-edge")
					   .text(this["album" + id].album);

		textBbox = text.node().getBBox();		
		
		this.svg.append("rect")
				.attr("x", textBbox.x - 2)
				.attr("y", textBbox.y - 2)
				.attr("height", textBbox.height + 4)
				.attr("width", textBbox.width + 4)
				.attr("class", "album-info")
				.attr("fill", "#222");
				
		text.moveToFront();
	}
	
	turnOnFeatureLabelHandler(id, index) {
		var context = this;
		return function(d, i) { context.turnOnFeatureLabel(id, index) };
	}
	
	turnOnFeatureLabel(id, i) {
		var coord = this.toRadialCoordinates(i, this["album" + id][FEATURES[i]], FEATURES.length);
		var text = this.svg.append("text")
						   .attr("x", coord[0])
						   .attr("y", coord[1] - 8)
						   .attr("class", "feature-label")
						   .text((+this["album" + id][FEATURES[i]]).toFixed(2));
						   
		var textBbox = text.node().getBBox();
						   
		this.svg.append("rect")
				.attr("x", textBbox.x - 2)
				.attr("y", textBbox.y - 2)
				.attr("class", "feature-label")
				.attr("fill", "#222")
				.attr("width", textBbox.width + 4)
				.attr("height", textBbox.height + 4);
				
		text.moveToFront();
	}
	
	defocusOfAlbumHandler(id) {
		var context = this;
		return function(d, i) { context.defocusOfAlbum(id, this, context) };
	}
	
	defocusOfAlbum(id, elem) {	
		var otherId = 3 - id;
		var startAngle = { 1: -0.75 * Math.PI, 2: 0.25 * Math.PI };
		var endAngle = { 1: 0.25 * Math.PI, 2: 1.25 * Math.PI };
				
		d3.select(elem)
		  .attr("d", () => {
			  var arc = d3.arc()
						  .innerRadius(0)
						  .outerRadius(this.smallRadius)
					      .startAngle(startAngle[id])
					      .endAngle(endAngle[id])();
						  
			  return arc.substring(0, arc.length - 5);
		  });
		  
		var otherGenre = this["album" + otherId].genre;
		this.svg.select("polygon." + otherGenre)
				.attr("stroke-opacity", 1);				
		this.svg.selectAll("circle." + otherGenre)
				.attr("opacity", 1);
				
		this.turnOffFeatureLabel();
	}
	
	turnOffFeatureLabel() {
		this.svg.selectAll(".feature-label,.album-info").remove();
	}
	
	toRadialCoordinates(index, value, maxIndex, minValue, maxValue) {
		if (minValue == undefined) {
			minValue = 0;
		}
		
		if (maxValue == undefined) {
			maxValue = 1;
		}
		
		var angle = 2 * Math.PI * index / maxIndex - Math.PI / 2;
		var radiusScale = d3.scaleLinear().domain([minValue, maxValue]).range([this.smallRadius + 3, this.bigRadius]);
		
		return [radiusScale(value) * Math.cos(angle), radiusScale(value) * Math.sin(angle)];
	}
}