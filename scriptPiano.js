
function drawTeclado(options={}) { 
	/*
	{
		// Obrigatorios
		canvas: undefined			// Elemento canvas que vai ser desenhado o teclado
		width: undefined			// Qual a largura que tem para desenhar o teclado

		// Caracterista
		oitava: 2					// Quantas oitavas que vai ter
		note_init: 'C'				// Com qual nota vai começar a desenhar
		is_silabica: false			// Se vai mostrar as notas no teclado usando silaba ou cifra
		click: (keyPress) => {} 	// Evento de click no teclad
		altura: 3					// Em qual altura vai começar a desenhar as notas (ex: 'C3')
		widthNote: 50				// Largura das teclas
		widthNoteAcidente: 40		// Largura das teclas que são acidentes (teclas pretas)

		// Restrição
		no_click: false				// Não ter evento de click
		onlyC: false				// Mostrar notação somente da nota C
		no_textAcidente: false		// Não mostrar notação das teclas que são acidentes
		no_altura: false			// Não mostrar notação das alturas das teclas
		no_text: false				// Não mostrar notação nenhuma
	}
	*/

	var oitavas 			= options.oitava || 2
	, 	tecla 				= 7 * oitavas + 1
	, 	note 				= options.note_init || 'C'
	, 	arrayAcidentes 		= []
	, 	widthTecla 			= options.widthNote || 50
	, 	widthTeclaAcidente 	= options.widthNoteAcidente || 40
	, 	altura 				= options.altura || 3
	, 	c 					= options.canvas
	// , 	ctx 				= c.getContext("2d")
	, 	teclado 			= { options, teclas: [] }

	var width 				= options.width;
	var drawText = true;

	if (width / tecla < widthTecla) { 
		var widthTeclaOld = widthTecla;
		widthTecla = width / tecla;
		widthTeclaAcidente = widthTecla * widthTeclaAcidente / widthTeclaOld;
	}

	c.width 		= widthTecla * tecla;
	c.height 		= widthTecla * 3.75;
	teclado.teclas 	= [];
	elemLeft 		= c.clientLeft;
	elemTop 		= c.clientTop;

	// Nota Naturais
	for (var i = 0; i < tecla; i++) { 
		if ((options.onlyC || '') != '' && note != 'C') { 
			drawText = false;
		} else {
			drawText = true;
		}

		teclado.teclas.push({
			x: widthTecla*i,
			y: 0,
			width: widthTecla,
			height: widthTecla*3.75,
			ck_acidente: false,
			note: note+altura,
			drawText: drawText,
			text: ((options.is_silabica || false) ? parseNoteToSilaba(note) : note) 
				+ ((options.no_altura || false) ? '' : altura),
		});

		if (['E','B'].indexOf(note) < 0 && i < tecla-1) { 
			arrayAcidentes.push({
				note: note + '#' + altura,
				pos: (widthTecla*i) + (widthTecla - (widthTeclaAcidente/2)),
				text: ((options.is_silabica || false) ? parseNoteToSilaba(note) : note) + '#' 
					+ ((options.no_altura || false) ? '' : altura),
			});
		}
		note = nextNote(note);
		if (note == 'C') altura += 1;
	}

	// Acidentes
	for (var i = 0; i < arrayAcidentes.length; i++) { 
		if ((options.onlyC || '') != '' || (options.no_textAcidente || '') != '') { 
			drawText = false;
		}

		teclado.teclas.push({
			note: arrayAcidentes[i].note,
			text: arrayAcidentes[i].text,
			x: arrayAcidentes[i].pos,
			y: 0,
			width: widthTeclaAcidente,
			height: widthTeclaAcidente * 3.33,
			ck_acidente: true,
			drawText: drawText,
		});
	}
	drawTecladoAction(teclado);

	if ((options.no_click || false) == false) { 
		c.addEventListener('click' , function(event) { 
			// var elemLeft 	= c.offsetLeft + c.clientLeft
			// , 	elemTop 	= c.offsetTop + c.clientTop
			var x 			= event.layerX
			, 	y 			= event.layerY
			, 	keyPress;

			teclado.teclas.forEach(function(e) {
				if (x >= e.x && x <= e.x + e.width &&
					y >= e.y && y <= e.y + e.height
				) {
					keyPress = e.note;
				}
			});

			// var ctx = c.getContext("2d");
			// ctx.beginPath();
			// ctx.arc(x, y, 10, 0, 2 * Math.PI);
			// ctx.fillStyle = 'red';
			// ctx.fill();
			// ctx.stroke();

			drawTecladoAction(teclado, keyPress);

			(options.click || function(){})(keyPress);
		}, false);
	}

	return teclado;
}

function drawTecladoAction(teclado, keyPress='') { 
	var	options = teclado.options
	, 	c 		= options.canvas
	, 	ctx 	= c.getContext("2d")
	, 	teclas 	= teclado.teclas;

	ctx.clearRect(0, 0, c.width, c.height);

	teclas.forEach(function(tecla) { 
		var corTecla = 'white';
		var corText = 'black';

		if ((tecla.ck_acidente || false)) { 
			corTecla = 'black';
			corText = 'white';
		}

		if (keyPress == tecla.note) { 
			corTecla = "orange";
		}

		// Tecla
		ctx.beginPath();
		ctx.fillStyle = corTecla;
		// ctx.rect(widthTecla*i, 0, widthTecla, 150);
		ctx.rect(tecla.x, tecla.y, tecla.width, tecla.height);
		ctx.fillRect(tecla.x, tecla.y, tecla.width, tecla.height);
		ctx.stroke();

		// Text
		if ((tecla.drawText || false) && (options.no_text || false) == false) { 
			ctx.fillStyle = corText;
			ctx.font = "12px Arial";
			ctx.fillText(tecla.text,tecla.x+3,tecla.height-5);
		}

		if (keyPress != '') { 
			setTimeout(function() { 
				drawTecladoAction(teclado);
			}, 500);
		}
	});
}

function nextNote(note) { 
	var notes = ['C','D','E','F','G','A','B'];
	var index = notes.indexOf(note);
	index++;
	if (index == notes.length) index = 0;
	return notes[index];
}

function parseNoteToSilaba(note) { 
	var notes 	= ['C','D','E','F','G','A','B']
	, 	silaba 	= ['Dó ','Ré ','Mi ','Fa ','Sol ','Là ','Si '];
	return silaba[notes.indexOf(note)];
}

function tocarMusica() { 
	// var bpm = 132;
	var bpm = 50;
	// Intro
	var intro = beeplay({bpm: bpm})
		.play(null, 1/4)
		.play('D#5', 1/2).play('D#5', 1/2)
		.play('G5', 1/4).play('F5', 1/4).play('D#5', 1/4)
		.play('C#5', 1/2).play('C#5', 1/2)
		.play('D#5', 1/4).play('C#5', 1/4).play('C5', 1/4)
		.play('G#4', 1/2).play('G#4', 1/2)
		.play('C#5', 1/2).play('G#4', 1/2)


		// .play('D#5', 1/4).play('E5', 1/4).play('F#5', 1/2)
		// .play('B5', 1/2).play('D#5', 1/4).play('E5', 1/4)
		// .play('F#5', 1/4).play('B5', 1/4).play('C#6', 1/4).play('D#6', 1/4)
		// .play('C#6', 1/4).play('A#5', 1/4).play('B5', 1/2)
		// .play('F#5', 1/2).play('D#5', 1/4).play('E5', 1/4)
		// .play('F#5', 1/2).play('B5', 1/2)
		// .play('C#6', 1/4).play('A#5', 1/4).play('B5', 1/4).play('C#6', 1/4)
		// .play('E6', 1/4).play('D#6', 1/4).play('E6', 1/4).play('C#6', 1/4);
}
