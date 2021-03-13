
function getConfigViewFormMusic(type) { 

	let funcSalvar, funcNovo, funcViewLetra, funcAddChord;

	eval(`funcAddChord = function () { habilitarModoAddAcorde("${type}"); }`);
	eval(`funcViewLetra = function () { mudarViewLetra("${type}"); }`);
	eval(`funcSalvar = function () { salvarMusica("${type}"); }`);
	eval(`funcNovo = function () { novaMusica("${type}"); }`);

	let formLetra = [
		{ 
			button: { icon: 'eye', class: 'btn btn-info'
				, classDiv: 'col-md-12 text-right', click: funcViewLetra
				, style: { 'margin-top': '15px' }
			}
		},
		{ 
			textarea: { text: 'Letra', id: 'letra_'+type, rows: '20', classDiv: 'col-md-12', required: true }
		},
		{ 
			div: { id: 'letra_view_'+type, classDiv: 'col-md-12', style: { 'display': 'none' }, text: ' ' }
		},
	];

	let formCifra = [
		{ 
			button: { icon: 'eye', class: 'btn btn-info' // , text: 'Editar Acordes'
				, classDiv: 'col-md-12 text-right', click: funcAddChord
				, style: { 'margin-top': '15px' }
			}
		},
		{
			div: { id: 'cifra_view_'+type, classDiv: 'col-md-12', text: ' ' }
		}
	];

	let formResumo = [

	];

	let formCriacao = [

	];

	let abasMenuMusica = [];
	abasMenuMusica.push({ text: 'Letra', ctx: formLetra });
	abasMenuMusica.push({ text: 'Cifra', ctx: formCifra });
	if (parseInt(usuario_Global.CK_ADMIN || 0) == 1) abasMenuMusica.push({ text: 'Resumo', ctx: formResumo });
	if (parseInt(usuario_Global.CK_ADMIN || 0) == 1) abasMenuMusica.push({ text: 'Criação', ctx: formCriacao });

	let form = [
		{ 
			input: { text: 'Nome', id: 'nome_'+type, classDiv: 'col-md-6', required: true }
		},
		{ 
			input: { text: 'Autor', id: 'autor_'+type, classDiv: 'col-md-6', required: true }
		},
		{
			menu: { descForm: 'menuMusica_'+type, no_link: true,
				classDiv: 'col-md-12', styleDiv: { 'margin-top': '15px' },
				abas: abasMenuMusica
			}
		}
	];

	// if (type == 'cover') { 
	// 	form.push({
			
	// 	});
	// }

	form.push({ 
		button: { desc: 'Salvar', icon: 'floppy-o', class: 'btn btn-block btn-success'
			, classDiv: 'col-md-6', style: { 'margin-top': '20px' }
			, click: funcSalvar
		}
	});

	form.push({ 
		button: { desc: 'Novo', icon: 'floppy-o', class: 'btn btn-block btn-primary'
			, classDiv: 'col-md-6', style: { 'margin-top': '20px' }
			, click: funcNovo 
		}
	});

	return form;
}

function getConfigViewMusic(type, form) { 
	return {
		menu: {
			descForm: 'menuMusica' + capitalize(type),
			no_link: true,
			abas: [
				{
					text: 'Cadastro',
					icon: 'pencil',
					ctx: form
				},
				{
					text: 'Lista',
					icon: 'list',
					ctx: [
						{
							div: { id: 'listaMusica' + capitalize(type) }
						}
					]
				}
			]
		}
	}
}

function salvarMusica(type) { 
	let form = serealizeForm(window['configForm_'+type]);
	if (!form) return;

	var cifras = $("#cifra_view_" + type).find('.cifra');
	var letras = $("#cifra_view_" + type).find('.letra');
	var cifraFull = [];

	for (let i = 0; i < cifras.length-1; i++) {
		cifraFull.push({ 
			pre: 	$(cifras[i]).find('.cifraPre').html(),
			cifra: 	$(cifras[i]).find('.cifraChord').html(),
			pos: 	$(cifras[i]).find('.cifraPos').html(),
			letra: 	letras[i].innerHTML,
		});

		Object.keys(cifraFull[i]).forEach(key => {
			cifraFull[i][key] = formataTextoCifra(cifraFull[i][key], true);
		});
	}
	console.log(form);

	ajax({
		param: {
			'cadastrarMusica': true,
			type,
			'nome' : form.param['nome_'  + type],
			'autor': form.param['autor_' + type],
			'letra': form.param['letra_' + type],
			'cifra': JSON.stringify(cifraFull),
			// 'cifra': $("#cifra_view_" + type).html(),
			'ck_autoral': type == 'autoral' ? true : '',
			'id_musica': window['indiceMusica' + capitalize(type) + '_Global']  == -1 ? '' : 
				window['musicas' + capitalize(type) + '_Global'][window['indiceMusica' + capitalize(type) + '_Global']].ID_MUSICA,
		},
		done: function(data, param) { 
			console.log(data);
			novaMusica(param.type);
			listarMusicas(param.type);
		}
	});
}

function novaMusica(type) { 
	clearForm(window['configForm_'+type]);
	window['indiceMusica' + capitalize(type) + '_Global'] = -1;
	$("#letra_" + type).css('display','block');
	$("#letra_view_" + type).css('display','none');
	window['modoAddAcorde' + capitalize(type) + '_Global'] = false;
}

function mudarViewLetra(type) { 
	if ($("#letra_" + type).css('display') == 'none') { 
		$("#letra_" + type).css('display','block');
		$("#letra_view_" + type).css('display','none');
	} else { 
		$("#letra_" + type).css('display','none');
		$("#letra_view_" + type).css('display','block');
	}
}

function habilitarModoAddAcorde(type) { 
	if (
		(usuario_Global.COMANDO || '').split(',').indexOf('EDITAR CIFRA') >= 0 || usuario_Global.CK_ADMIN == '1'
	) { 
		window['modoAddAcorde' + capitalize(type) + '_Global'] = 
			!window['modoAddAcorde' + capitalize(type) + '_Global'];
	} else { 
		window['modoAddAcorde' + capitalize(type) + '_Global'] = false;
	}
	setViewBtnsAcorde(type);
}

function setViewBtnsAcorde(type) { 
	$("#cifra_view_" + type).find('button').css('display',
		window['modoAddAcorde' + capitalize(type) + '_Global'] ? 'inline-block' : 'none'
	);
}

function listarMusicas(type) { 
	ajax({
		param: {
			'listaMusica': true,
			'autoral': type == 'autoral' ? true : '',
			'cover': type == 'cover' ? true : '',
			type
		},
		done: function(data, { type }) {
			console.log(data);
			data = JSON.parse(data);
			console.log(data);

			let grade = data[0].debug;
			window['musicas' + capitalize(type) + '_Global'] = data;

			if (grade == 'OK') { 
				let inputs = [
					{ head: 'Nome'			, param: 'NOME' 	},
					{ head: 'Autor'			, param: 'AUTOR' 	},
				]

				if (type == 'cover') { 
					inputs.push({ head: 'Prioridade', align: 'center'
						, param: dt => ''
							+ `<span style="display:none;">${dt.PRIORIDADE}</span>`
							+ [1,2,3].map( num => ''
								+ `<img src="../img/aval/icon${dt.PRIORIDADE >= num ? 1 : 0}.png" width="20px;">` 
							).join('')
					});
				}

				inputs.push({ head: '', align: 'center'
					, param: function(dt) { 
						return `
							<button class="btn btn-warning" onclick="editarMusica(${dt.ID_MUSICA},'${type}');">
								<i class="fa fa-pencil"></i>
							</button>`;
					}
				});

				if (parseInt(usuario_Global.CK_ADMIN || 0) == 1) { 
					inputs.push({ head: '', align: 'center'
						, param: function(dt) { 
							return `
								<button class="btn btn-danger" onclick="cancelarMusica(${dt.ID_MUSICA});">
									<i class="fa fa-times"></i>
								</button>`;
						}
					});
				}

				grade = resolvGrade(data, { 
					inputs
					, descForm: 'listaMusica'+capitalize(type)
					, style: { tbody: { td: {
						'background-color': dt => parseInt(dt.CK_INATIVO) == 1 ? 'salmon' : 'white'
					}}}
				});
			}
			$("#listaMusica"+capitalize(type)).html(grade);
		}
	});
}

function editarMusica(id, type) { 
	var indice = returnIndiceMusica(id, type);
	if (indice < 0) return;

	novaMusica(type);
	let idParam = 'musicas' + capitalize(type) + '_Global';
	$("#nome_" 			+ type).val(window[idParam][indice].NOME);
	$("#autor_" 		+ type).val(window[idParam][indice].AUTOR);
	$("#letra_" 		+ type).val(window[idParam][indice].LETRA.replace(/<br>/gi, '\n'));
	$("#letra_view_" 	+ type).html(window[idParam][indice].LETRA);

	if ((window[idParam][indice].CIFRA || '') == '') { 
		window[idParam][indice].CIFRA = window[idParam][indice].LETRA.split('<br>').map(letra => ({
			letra, cifra: ''
		}));
	} else {
		window[idParam][indice].CIFRA = JSON.parse(
			window[idParam][indice].CIFRA.replace(/\'/g, "\"").replace(/\n/g, "")
				.replace(/&nbsp;/gi, " ").replace(/<br>/gi, "\n")
		);

		console.log(window[idParam][indice].CIFRA);
	}

	$("#cifra_view_" + type).html((
		window[idParam][indice].CIFRA.map((dt,i) => ''
			+ retornaLinhaCifra(type, dt, i)
		).join('')
		+ retornaLinhaCifra(type, {}, window[idParam][indice].CIFRA.length, true)
	));
	// .find('button').css('display',usuario_Global.CK_ADMIN != '1' ? 'none' : 'block');
	window['modoAddAcorde' + capitalize(type) + '_Global'] = false;
	setViewBtnsAcorde(type);

	window['indiceMusica' + capitalize(type) + '_Global'] = indice;
	$("#menuMusica" + capitalize(type) + "0")[0].click();

	$("#letra_" + type).css('display','none');
	$("#letra_view_" + type).css('display','block');
}

function cancelarMusica(id, type) { 
	var indice = returnIndiceMusica(id, type);
	if (indice < 0) return;

	if (!confirm('Deseja apagar registro?')) return;
	ajax({
		param: { 
			'apagarMusica': true,
			'id_musica': id,
			type
		},
		done: function(data, { type }) { 
			console.log(data);
			alert(data == 1 ? 'Apagado com sucesso!' : 'Falha ao apagar!');
			listarMusicas(type);
		}
	});
}

function returnIndiceMusica(id, type) { 
	return window['musicas' + capitalize(type) + '_Global'].map(d => parseInt(d.ID_MUSICA)).indexOf(id);
}

function retornaLinhaCifra(type, dt, i, lastLine=false) { 
	dt.pre 		= formataTextoCifra((dt.pre 	|| ''));
	dt.cifra 	= formataTextoCifra((dt.cifra 	|| ''));
	dt.pos 		= formataTextoCifra((dt.pos 	|| ''));
	dt.letra 	= formataTextoCifra((dt.letra 	|| ''));

	var html = ''
		+ '<div class="linhaChord">'
		+ 	'<table>'
		+ 	'<tr>'
		+ 		'<td style="white-space: nowrap;">'
		+ (	usuario_Global.CK_ADMIN != '1' && 
			(usuario_Global.COMANDO || '').split(',').indexOf('EDITAR CIFRA') < 0 
			? '' : ''
			+ 		'<button class="btn btn-success" style="margin-right:10px;"'
			+ 			' onclick="adicionarLinha('+i+',\'' + type + '\');"'
			+ 		'>'
			+ 			'<i class="fa fa-plus"></i>'
			+ 		'</button>'
			+ (lastLine ? '' : ''
				+ 	'<button class="btn btn-danger" style="margin-right:10px;"'
				+ 		' onclick="removerLinha(this,\'' + type + '\');"'
				+ 	'>'
				+ 		'<i class="fa fa-minus"></i>'
				+ 	'</button>'
				+ 	'<button class="btn btn-warning" style="margin-right:10px;"'
				+ 		' onclick="editarLinha(this);"'
				+ 	'>'
				+ 		'<i class="fa fa-pencil"></i>'
				+ 	'</button>'
			)
		)
		+ 		'</td>'
		+ 		'<td>'
		+ 			'<div class="cifra" style="margin:0;">'
		+ 				'<span class="cifraPre" style="color: black">' 	+ (dt.pre 	|| '') + '</span>'
		+ 				'<span class="cifraChord">' 					+ (dt.cifra || '') + '</span>'
		+ 				'<span class="cifraPos" style="color: black">' 	+ (dt.pos 	|| '') + '</span>'
		+ 			'</div>'
		+ 			'<div class="letra" style="margin:0;">'
		+ 				(dt.letra || '')
		+ 			'</div>'
		+ 	'</tr>'
		+ 	'</table>'
		+ '</div>'
	return html;
}

function formataTextoCifra(text, desformatar=false) { 
	if (desformatar) { 
		text = text.replace(/"/g, "[||]")
					.replace(/'/g, "[|]")
	} else {
		text = text.replace(/\[\|\|\]/g, "\"")
					.replace(/\[\|\]/g, "'")
					.replace(/ /g, '&nbsp;')
	}
	return text;
}

function adicionarLinha(indice, type) { 
	var linhas = $("#cifra_view_" + type).find('.linhaChord'), html = '';
	for (var i = 0; i < linhas.length; i++) { 
		if (indice == i) 
			html += retornaLinhaCifra(type, {}, indice);

		html += '<div class="linhaChord">' + linhas[i].innerHTML + '</div>';
	}
	$("#cifra_view_" + type).html(html);
	clickBtnAdicionaLinha(type);
}

function clickBtnAdicionaLinha(type) { 
	var btns = $("#cifra_view_" + type).find('.btn-success');
	for (var i = 0; i < btns.length; i++) { 
		eval(`btns[${i}].onclick = function() { adicionarLinha(${i}, "${type}"); }`);
	}
}

var linhaEditada_Global;
function editarLinha(el) { 
	linhaEditada_Global = $(el).parent().parent().parent();
	$("#linhaAcordesPre").val($(linhaEditada_Global).find('.cifra').find('.cifraPre').html().replace(/&nbsp;/g, ' '));
	$("#linhaAcordesPos").val($(linhaEditada_Global).find('.cifra').find('.cifraPos').html().replace(/&nbsp;/g, ' '));
	$("#linhaAcordes").val($(linhaEditada_Global).find('.cifra').find('.cifraChord').html().replace(/&nbsp;/g, ' '));
	$("#letraAcordes").val($(linhaEditada_Global).find('.letra').html().replace(/&nbsp;/g, ' '));
	$("#modalLinhaAcorde").modal('show');
	previewLinhaCifra();
}

function removerLinha(el, type) { 
	linhaEditada_Global = $(el).parent().parent().parent().parent().parent();
	$(linhaEditada_Global).remove();
	clickBtnAdicionaLinha(type);
}

function previewLinhaCifra() { 
	let cifra = $("#linhaAcordes").val().replace(/ /g, '&nbsp;')
	let letra = $("#letraAcordes").val().replace(/ /g, '&nbsp;')
	let pre = $("#linhaAcordesPre").val().replace(/ /g, '&nbsp;')
	let pos = $("#linhaAcordesPos").val().replace(/ /g, '&nbsp;')

	$(linhaEditada_Global).find('.cifra').html(''
		+ 			'<span class="cifraPre" style="color: black">' 	+ pre 	+ '</span>'
		+ 			'<span class="cifraChord">' + cifra + '</span>'
		+ 			'<span class="cifraPos" style="color: black">' 	+ pos 	+ '</span>'
	);
	$(linhaEditada_Global).find('.letra').html(letra);

	$("#previewLinhaCifra").html(''
		+ 	'<div style="color: orange">'
		+ 		'<span class="cifraPre" style="color: black">' + pre + '</span>'
		+ 		cifra 
		+ 		'<span class="cifraPre" style="color: black">' + pos + '</span>'
		+ 	'</div>'
		+ 	'<div>' + letra + '</div>'
	);
}


// function insertBreakAtPoint(e, type) { 
// 	var range;
// 	var textNode;
// 	var offset;
  
// 	if (document.caretPositionFromPoint) { 
// 		range = document.caretPositionFromPoint(e.clientX, e.clientY);
// 		textNode = range.offsetNode;
// 		offset = range.offset;
// 	} else if (document.caretRangeFromPoint) { 
// 		range = document.caretRangeFromPoint(e.clientX, e.clientY);
// 		textNode = range.startContainer;
// 		offset = range.startOffset;
// 	}
  
// 	// only split TEXT_NODEs
// 	if (textNode.nodeType == 3) { 
// 		var replacement = textNode.splitText(offset);
// 		var span = document.createElement('span');
// 		var chord = prompt("Informe o acorde");

// 		span.innerHTML = chord + '&nbsp;';
// 		// span.style.color = 'red'
// 		textNode.parentNode.insertBefore(span, replacement);
		
// 		var position = getOffset(span);
// 		console.log(position);
// 	}
// }

// function getOffset( el ) { 
// 	var _x = 0, _y = 0, width = 0, height = 0;

// 	while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) { 
// 		_x += el.offsetLeft - el.scrollLeft;
// 		_y += el.offsetTop - el.scrollTop;
// 		el = el.offsetParent;
// 		width = el.clientWidth;
// 		height = el.clientHeight;
// 	}

// 	return { 
// 		top: _y, left: _x, bottom: _y + height, right: _x + width, 
// 		width, height
// 	};
// }

// window.onload = function () { 
// 	var paragraphs = document.getElementsByTagName("div");
// 	for (i=0 ; i < paragraphs.length; i++) { 
// 		paragraphs[i].addEventListener("click", insertBreakAtPoint, false);
// 	}
// };