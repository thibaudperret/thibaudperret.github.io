function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

var INFO = { 
 1947: ["Creation of 'Atlantic Records', a major label in R&B"],
 1949: ["The term 'Rhythm and Blues' replaced the Billboard category 'Race Records' for music of African American Origin destined to a black audience"],
 1950: ["Ruth Brown sing 'Teardrops from My Eyes', the title stay as BillBoard\u2032s number-one R&B hit for 11 non-consecutive weeks and Brown earned the title of 'Queen of the R&B'"],
 1957: ["Elvis Presley one of the first non african american artist to enter Rhythm and Blues Billboard chart with 'Jailhouse Rock' and 'All Shook up' "], 
 1960: ["Start of mob culture in UK influenced by R&B music, there music is named as British Rythm and Blues", "Music industry start labeling Rhythm and Blues form white artist under genre of Blue Eyed Soul"],
 1963: ["Billboard combine its pop and R&B chart because there were too similar", "The Who record there first album 'My Generation' under 'Maximum R&B' genre"], 
 1964: ["The Rolling Stones publish there first eponym album registered under British R&B"], 
 1965: ["The Billboard changed name for music of African American Origin to 'R&B' "], 
 1969: ["The Billboard renamed African American Origin music to from 'R&B' to 'soul'", "Grammys first added Rhythm and Blues category, giving it a academic recognition"],
 1980: ["Contemporary R&B is created after the demise of disco in the 80s it is 'a genre of smooth pop music that is entirely centered on the vocalist' and different from original Rhythm and Blues music"],
 1982: ["The Billboard renamed African American Origin music to from 'soul' to 'black'"], 
 1986: ["Release of Control by Janet Jackson, 'Control is regarded as one of the most influential albums in the history of rhythm and blues and the first album to bridge the gap between R&B and rap music.' (musicologist Richard J. Ripani, author of The New Blue Music: Changes in Rhythm & Blues, 1950\u20131999 (2006)). It also popularize new jack swing genre."],
 1988: ["George Nelson, music editor to Billboard describe the development of retail outlets for R&B records in a book named 'The Death of Rhythm and Blues'"], 
 1989: ["Mariah Carey 'Vision of love' single becomes reach the number 1 US Billboard Hot 100 and popularize melisma (singing of a single syllable of text while moving between several different notes in succession) in R&B"],
 1990: ["The Billboard finally changed the soul category to 'R&B' and it remains until today to represent more a type of music than a the race of an audience"], 
 1995: ["First Grammy Award for Best R&B Album goes to II by Boyz II Men"], 
 2003: ["The music journalist Robert Christgau said 'Modern r&b isn't about discrete songs. It's about texture, mood, feel\u2014vocal and instrumental and rhythmic, articulated as they're smooshed together.'"]
}

whenDocumentLoaded(() => {
	$.getJSON("./rnb_data.json", function(json) {
		var graph = new Graph(json, INFO);
		graph.redraw();
	});
});

class Graph {
	constructor(data, info) {
		this.data = data;
		this.info = info;
		this.year = 1969;
		this.xFeature = "energy";
		this.yFeature = "danceability"
		this.xScale = d3.scaleLinear().domain([0, 1])
		                              .range([0, 200]);
		this.yScale = d3.scaleLinear().domain([0, 1])
		                              .range([200, 0]);
		this.svg = d3.select("#vis");
	}
	
	redraw() {
		this.svg.selectAll("circle")
				.data(this.data.filter(d => d.year == this.year))
				.enter()
				.append("circle")
				.attr("cx", d => this.xScale(d[this.xFeature]))
				.attr("cy", d => this.yScale(d[this.yFeature]))
				.on("mouseover", mouseover(this))
				.on("mouseout", mouseout(this))
				.attr("class", d => "normal " + d.genre)
				.attr("r", 0)
				.transition()
				.attr("r", 2);
				
		if (this.info[this.year] != undefined) {
			var infoCard = this.svg.selectAll("rect")
								   .data(this.info[this.year])
								   .enter();
			
			infoCard.append("rect")
					.attr("x", this.xScale(1))
					.attr("width", 80)
					.attr("height", 50)
					.attr("fill", "#fff")
					.attr("y", -100)
					.transition()
					.attr("y", (d, i) => i * 55 - 10);
					
			infoCard.append("text")
					.attr("x", this.xScale(1) + 5)
					.attr("font-size", 5)
					.attr("alignment-baseline", "text-before-edge")
					.text(d => d)
					.call(wrap, 70)
					.attr("y", -100)
					.transition()
					.attr("y", (d, i) => i * 55 + 10 - 10);
		}
		   
		this.drawAxis();
	}
	
	drawAxis() {
		// x-axis
		this.svg.append("line")
				.attr("x1", this.xScale(0))
				.attr("y1", this.yScale(0))
				.attr("x2", this.xScale(1))
				.attr("y2", this.yScale(0))
				.attr("class", "axis");
		   
		// y-axis
		this.svg.append("line")
				.attr("x1", this.xScale(0))
				.attr("y1", this.yScale(0))
				.attr("x2", this.xScale(0))
				.attr("y2", this.yScale(1))
				.attr("class", "axis");
		
		// x-label
		this.svg.append("text")
				.attr("x", this.xScale(0.5))
				.attr("y", this.yScale(-0.05))
				.attr("class", "axis label")
				.text(this.xFeature);
		
		// y-label
		this.svg.append("text")
				.attr("transform", "translate(" + this.xScale(-0.05) + "," + this.yScale(0.5) + ") rotate(270)")
				//.attr("x", )
				//.attr("y", this.yScale(0.5))
				.attr("class", "axis label")
				.text(this.yFeature);
		
		// title
		this.svg.append("text")
				.attr("x", this.xScale(0.5))
				.attr("y", -5)
				.attr("class", "axis year")
				.text(this.year);
	}
	
	changeYear(year) {
		this.year = year;
	}
}

function mouseover(graph) {
	return function(d, i) {
		display_info(d, i, graph, this);
	}
}

function display_info(d, i, graph, elem) {
	var g = graph.svg.append("g")
	                 .attr("class", "song-info");
					   
	var cardX;
	if (d[graph.xFeature] < 0.5) {
		cardX = graph.xScale(d[graph.xFeature]) + 5;
	} else {
		cardX = graph.xScale(d[graph.xFeature]) - 5 - 60;
	}
	var cardY = graph.yScale(d[graph.yFeature]) - 40;
	if (cardY <= 0) {
		cardY = 10;
	}
	
	g.append("rect")
	 .attr("class", "base-card")
	 .attr("x", cardX)
	 .attr("y", cardY);
	 
	g.append("text")
	 .attr("class", "band-name")
	 .attr("x", cardX + 5)
	 .attr("y", cardY + 62)
	 .text(d.artists)
	 .call(wrap, 50);
	 
	g.append("text")
	 .attr("class", "song-name")
	 .attr("x", cardX + 5)
	 .attr("y", cardY + 74)
	 .text(d.name)
	 .call(wrap, 50);
	 
	g.append("image")
	 .attr("class", "cover-img")
	 .attr("x", cardX + 5)
	 .attr("y", cardY + 5)
	 .attr("xlink:href", d.cover);
	 
	d3.select(elem)
	  .attr("class", "selected " + d.genre)
}

function mouseout(graph) {
	return function(d, i) {
		remove_info(d, i, graph, this);
	}
}

function remove_info(d, i, graph, elem) {	
	graph.svg.selectAll(".song-info")
			   .remove();
	d3.select(elem)
	  .attr("class", "normal " + d.genre);
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(" ").reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}