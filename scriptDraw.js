
function resolvDraw(draw, options) { 
	/*
		options: {
			canvas: el 							-- Elemento canvas que vai desenhar
			maxV: num 							-- Referencia de maior valor para calcular na escala
			start: { 							-- Ponto onde vai começar o desenho
				x: 0
				y: 0
			}
			attr: { 							-- Vem padrão do proprio desenho porem pode ser sobrescrito
				"fill": "#000",
				"fill-opacity": "1",
				"stroke": "#000",
				"stroke-width": "0.34316409",
				"stroke-linecap": "butt",
				"stroke-linejoin": "miter",
				"stroke-miterlimit": "4",
				"stroke-dasharray": "none",
				"stroke-opacity": "1"
			}
		}
	*/

	var canvas = options.canvas;
	if (!canvas.getContext) return false;

	var ctx = canvas.getContext('2d');
	var offset = {
		startX: ((options.start || {}).x || 0),
		startY: ((options.start || {}).y || 0),
		endX: ((options.start || {}).x || 0),
		endY: ((options.start || {}).y || 0),
	}

	draw.forEach(function(path) { 
		var coords = parseScale(path.d, options.maxV);
		var attr = $.extend(path.attr, (options.attr || {}));
		var keys = Object.keys(attr);
		for (var j = 0; j < keys.length; j++) { 
			valor = attr[keys[j]];
			switch (keys[j]) { 
				case 'fill': 			ctx.fillStyle = valor; 							break;
				case 'fill-opacity': 	if (parseFloat(valor) == 0) isFill = false; 	break;
				case 'stroke': 			ctx.strokeStyle = valor; 						break;
				case 'stroke-width': 	ctx.lineWidth = valor; 							break;
				case 'stroke-opacity': 	if (parseFloat(valor) == 0) isStroke = false; 	break;
			}
		}
		ctx.beginPath();

		for (var j = 0; j < coords.length; j++) { 
			if (((options.start || {}).x || 0) + coords[j].x > offset.endX)
				offset.endX = ((options.start || {}).x || 0) + coords[j].x;

			if (((options.start || {}).y || 0) + coords[j].y > offset.endY)
				offset.endY = ((options.start || {}).y || 0) + coords[j].y;

			if (j == 0) { 
				ctx.moveTo(
					((options.start || {}).x || 0) + coords[j].x,
					((options.start || {}).y || 0) + coords[j].y
				);
			} else if(Object.keys(coords[j]).indexOf('dx2') != -1) { 
				ctx.bezierCurveTo(
					((options.start || {}).x || 0) + coords[j].dx1,
					((options.start || {}).y || 0) + coords[j].dy1,
					((options.start || {}).x || 0) + coords[j].dx2,
					((options.start || {}).y || 0) + coords[j].dy2,
					((options.start || {}).x || 0) + coords[j].x,
					((options.start || {}).y || 0) + coords[j].y
				);
			} else if(Object.keys(coords[j]).indexOf('dx1') != -1) { 
				ctx.quadraticCurveTo(
					((options.start || {}).x || 0) + coords[j].dx1,
					((options.start || {}).y || 0) + coords[j].dy1,
					((options.start || {}).x || 0) + coords[j].x,
					((options.start || {}).y || 0) + coords[j].y
				);
			} else { 
				ctx.lineTo(
					((options.start || {}).x || 0) + coords[j].x,
					((options.start || {}).y || 0) + coords[j].y
				);
			}
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	});
	return offset;
}

function parseScale(coods, maxV=false) { 
	var newC = [], i, set = true;

	if (maxV == false) maxV = (set = false, getMaxValueScale(coods));

	coods.forEach(function(c) { 
		i = newC.length;
		newC.push({});
		['x','y','dx','dy','dx1','dy1','dx2','dy2'].forEach(function(p) { 
			if ((c[p] || '') != '') { 
				eval('newC[i][p] = ' + String(c[p]) + (set ? '*' : '/') + String(maxV));
			}
		});
	});

	return newC;
}

function getMaxValueScale(coods) { 
	var maxValue = 0;

	coods.forEach(function(cood) { 
		if (maxValue < cood.x) maxValue = cood.x;
		if (maxValue < cood.y) maxValue = cood.y;
	});

	return maxValue;
}
