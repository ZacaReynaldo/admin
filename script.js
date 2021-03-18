/** Arquivo de Funções genericas para ajudar na parametrização da aplicação */

/**
 * Se tenta criar uma perperctiva sobre mim
 * Porém eu não sou um espectativa
 * Eu sou um personagem real nesse mundo de faz de contas
 * 
 * O que disserem, do que fizeram, ofender o seu ego, é sinapcial
*/
var isMobile_Global = false, userAgent = String(navigator.userAgent).toUpperCase(), plataformasMobile = ['ANDROID','IOS'];
for (var i = 0; i < plataformasMobile.length; i++) if (userAgent.indexOf(plataformasMobile[i]) != -1) isMobile_Global = true;

var objParamGrade_Global = { 
	tamanhoFont: 12,
	fontFamily: 'NomeDaFont',

	// Config Table
	classTable: 		'table table-bordered stripe table-hover table-condensed table-responsive backTeste', // table-striped
	titleTableBgColor: 	'#D5DEE3', 	// '#981818',
	titleTableColor: 	'black',
	titleTableWeight: 	'bold',		// 'bold',
	headTableBgColor: 	'#D5DEE3', 	// '#c52e32',
	headTableColor: 	'black',
	headTableWeight: 	'bold',		// 'normal',
	footTableBgColor: 	'#D5DEE3', 	// '#e74f54',
	footTableColor: 	'black',
	footTableWeight: 	'bold',		// 'normal',
	// stripTableColors: 	[{bgcolor:'#E8E8E8'},{bgcolor:'#c0c0c0'}],
	stripTableColors: 	[{bgcolor:'white'}],
	hoverTrTableColor: 	'lightblue',
	activeTrTableColor: '#66ccff',
	// stripTableColors: 	[{bgcolor:'lightgreen'},{bgcolor:'cadetblue'}],
	padination: 		[15,25],

	// Cofig plataforma
	isMobile_Global: 	isMobile_Global,
	// stripTableColors: [{bgcolor:'tomato'},{bgcolor:'mediumseagreen'}],
	no_scrollX: 		true,
	languageJson: 		'../js/Portuguese.json'
}

function resolvBarraBotoes() { 
	var barraBotoes = {
		div: { 
			class: 'text-right',
			style: { 'margin-top':'5px', 'margin-right': '5px', 'margin-bottom':'4px' },
			ctx: [
				{ title: 'Novo' 		, btn: 'primary' 	, click: 'incluirDados' 		, icon: 'file' 			, key: "n" },
				{ title: 'Salvar' 		, btn: 'success' 	, click: 'gravaDados' 			, icon: 'floppy-o' 		, key: "s" },
				{ title: 'Inativar' 	, btn: 'danger' 	, click: 'inativaDados' 		, icon: 'times' 		, key: "e" },
				{ title: 'Imprimir' 	, btn: 'warning' 	, click: 'imprimirDados' 		, icon: 'print' 		, key: "p" },
				{ title: 'Primeiro' 	, btn: 'info' 		, click: 'posicionarPrimeiro' 	, icon: 'arrow-left' 	, key: "8" },
				{ title: 'Anterior' 	, btn: 'info' 		, click: 'posicionarAnterior' 	, icon: 'chevron-left' 	, key: "4" },
				{ title: 'Próximo' 		, btn: 'info' 		, click: 'posicionarProximo' 	, icon: 'chevron-right' , key: "6" },
				{ title: 'Último' 		, btn: 'info' 		, click: 'posicionarUltimo' 	, icon: 'arrow-right' 	, key: "2" },
			].map(function(p) { 
				var { title, btn, click, icon, key } = p
				, 	onclick, id = 'btn' + tirarAcentuacao(title), disabled = title == 'Imprimir';
				eval(`onclick = function() { ${click}(); }`);

				return { button: { 
					id, title, onclick, class: 'btn btn-' + btn, accesskey: key, icon: icon + ' fa-lg', disabled
				} };
			}),
		},
	};

	return barraBotoes;
}

function resolvAbaMenu(array) { 
	var html = '';
	for (var i = 0; i < array.length; i++) {
		html += ""
			+ 	"<div class='col-md-3 col-sm-6 col-xs-12' data-file='" + array[i].file + "'"
			+ 		"onclick='abrirConteudo(this, \"" + array[i].desc + "\"" 
			+ 			(arguments.length > 1 ? "," + arguments[1] : '') + ");'"
			+ 	">"
			+ 		"<div class='box box-solid box-default' data-widget='box-widget'>"
			+ 			"<div class='box-header'>"
			+ 				"<h3 class='box-title'>"+array[i].desc+"</h3>"
			+ 			"</div>"
			+ 			"<div class='box-body'>"
			+ 				"<center>"
			+ 					((array[i].icon || '') == '' ? "" : "<img src='img/icones/" + array[i].icon + "' width='40%'><br>")
			+ 				"</center>"
			+ 			"</div>"
			+ 		"</div>"
			+ 	"</div>"
	}
	$("#conteudoAbaMenu").html(html);
}

function resolveMenu(menu) { 
	var html = "", linkMenu_i;
	for (var i = 0; i < menu.length; i++) { 
		if ((menu[i].header || '') != '')
			html += "<li class=\"header\">" + menu[i].header + "</li>"
		else if ((menu[i].itens || '') == '')
			html += "<li class=\"treeview\">"
				+ 		"<a href=\"#\" data-file=\"" + menu[i].file + "\" "
				+ 			"onclick=\"abrirConteudo(this,'" + (menu[i].desc || '') + "');\""
				+ 		">"
				+ 			(menu[i].desc || '')
				+ 		"</a>"
				// + 		"<ul class=\"treeview-menu\">"
				// + 			"<li><a href=\"principal.html\"><i class=\"fa fa-circle-o\"></i> Principal</a></li>"
				// + 		"</ul>"
				+ 	"</li>"
		else { 
			linkMenu_i = ((menu[i].file || '') == '' ? '' : menu[i].file + ",") + menu[i].desc;

			html += ""
				+ 	"<li class=\"treeview\">"
				+ 		"<a href=\"#\">"
				+ 			"<span>" + menu[i].desc + "</span>"
				+ 			"<span class=\"pull-right-container\">"
				+ 				"<i class=\"fa fa-angle-left pull-right\"></i>"
				+ 			"</span>"
				+ 		"</a>"
				+ 		"<ul class=\"treeview-menu\">"
			for (var j = 0; j < menu[i].itens.length; j++) { 
				if (
					parseInt(usuario_Global.CK_ADMIN || 0) == 1 || 
					(menu[i].itens[j].admin || '') == ''
				) { 
					html += "" 
						+ 	"<li>"
						+ 		"<a href=\"#\" data-file=\"" + menu[i].itens[j].file + "\""
						+ 			" onclick=\"abrirConteudo(this,'" + menu[i].itens[j].desc + "','" + linkMenu_i + "');\""
						+ 		">"
						+ 			"<i class=\"fa fa-circle-o\"></i> " + menu[i].itens[j].desc
						+ 		"</a>"
						+ 	"</li>"
				}
			}
			html += ""
				+ 		"</ul>"
				+ 	"</li>"
		}
	}
	return html;
}

var base64Foto_Global = [];
function setBase64(input, id, idPreview='') {  readURL(input, id, idPreview); }
function readURL(input, id, idPreview='') { 
	/* if (idCategoria_Global == -1) {
		alert('Selecione o Registro!');
		$("#" + id).val('');
		return;
	} */

	if (input.files && input.files[0]) { 
		var reader = new FileReader();
		reader.onload = function(e) { 
			var indice = base64Foto_Global.map(function(e) { return e.id; }).indexOf(id);
			var nome = $("#" + id).val().split('.');
			var ext = (nome.splice(nome.length-1,1)).join('');
			nome = nome.join('.').replace(/\\/g, "/");
			nome = nome.substring(nome.lastIndexOf('/')+1, nome.length);

			if (indice < 0) { 
				indice = base64Foto_Global.length;
				base64Foto_Global.push({ id, base64: e.target.result, ext, nome: nome });
			} else { 
				base64Foto_Global[indice].base64 = e.target.result;
				base64Foto_Global[indice].ext = ext;
			}
			if (idPreview != '') { 
				$("#" + idPreview).attr('src',base64Foto_Global[indice].base64);
			}
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function getBase64(id, param='base64') { 
	var indice = base64Foto_Global.map(function(d) { return d.id; }).indexOf(id);
	if (indice < 0) return false;
	if (param == 'base64')
		return base64Foto_Global[indice].base64.split(';base64,')[1];

	return base64Foto_Global[indice][param];
}

function clearBase64(id) { 
	var indice = base64Foto_Global.map(function(d) { return d.id; }).indexOf(id);
	base64Foto_Global.splice(indice,1);
}

function sendBase64(options) { 
	/*
		options: {
			id: '' 					// achar o base64
			div: '#' 				// desenhar o progresso do upload
			fileName: ''			// orientar onde está o download
			onstart: function		// dispara na primeira vez que chama a rotina
			ondone: function		// dispara quando termina de enviar o arquivo
			path: '' 				// caminho para salvar o arquivo
			limitChar: 7000000 		// quantos caracteres vai ser enviado por vez
			url: '' 				// para onde vai o arquivo
			no_base64: (0|1) 		// se o conteudo do arquivo não for base64
		}

		base64Foto_Global: {
			base64: ''
			ext: ''
			id: ''
			nome: ''
		}
	*/
	var indice = base64Foto_Global.map(function(i) { return i.id; }).indexOf(options.id);
	if (indice < 0) return false;

	if (base64Foto_Global[indice].base64.length == 0) { 
		options.fileName = (options.fileName || base64Foto_Global[indice].nome.replace(/ /g, '_'));
		options.ext = base64Foto_Global[indice].ext;
		base64Foto_Global.splice(indice, 1);
		doneSendBase64(options);
		return true;
	}

	if ((options.tempName || '') == '') { 
		if (typeof(options.onstart) == 'function') options.onstart(options);
		if ((options.no_base64 || '') == '')
			base64Foto_Global[indice].base64 = base64Foto_Global[indice].base64.split(';base64,')[1];
		options.totalChart = base64Foto_Global[indice].base64.length;
	}

	var progress = (base64Foto_Global[indice].base64.length*100) / options.totalChart;
	progress = 100 - progress;
	$(options.div).html(''
		+ 	`<div class="progress">`
		+ 		`<div class="progress-bar" role="progressbar" aria-valuenow="${progress}"`
		+ 			`aria-valuemin="0" aria-valuemax="100" style="width:${progress}%"`
		+ 		`>`
		+ 			`<span class="sr-only">${String(parseFloat(progress.toFixed(2))).replace('.',',')}% Completo</span>`
		+ 		`</div>`
		+ 	`</div>`
	);

	if ((options.limitChar || '') == '') options.limitChar = 7000000;

	ajax({ 
		url: (options.url || '../controller/controller.php'),
		param: { 
			'sendBase64': true,
			'tempName': (options.tempName || ''),
			'base64': base64Foto_Global[indice].base64.substring(0, options.limitChar),
		},
		error: function() { alert('Falha ao enviar arquivo!'); },
		done: function(data) { 
			console.log(data);
			base64Foto_Global[indice].base64 = base64Foto_Global[indice].base64
				.substring(options.limitChar, base64Foto_Global[indice].base64.length);

			options.tempName = data;
			sendBase64(options);
		}
	});
}

function doneSendBase64(options) { 
	$(options.div).html('Salvando Arquivo...');
	ajax({
		url: (options.url || '../controller/controller.php'),
		param: { 
			'doneSendBase64': true,
			'tempName': options.tempName,
			'fileName': options.fileName,
			'path': (options.path || './'),
			'ext': options.ext,
			'no_base64': (options.no_base64 || ''),
		},
		error: function() { alert('Falha ao enviar arquivo!'); },
		done: function(data) { 
			console.log(data);
			$(options.div).html('');
			if (typeof(options.ondone) == 'function') options.ondone(options);
		}
	});
}

var processAjax_Global = false;
function ajax(option) { 
	registerAjaxFunc(function() { ajaxExecute(option) });
}

function ajaxExecute(option) { 
	processAjax_Global = true;

	if (typeof(option.erro) == 'function') { 
		var erro = option.erro
	} else {
		eval(option.erro);
	}

	$.ajax({
		  url: 		(option.url 		|| (window['caminhoRequisicao'] || '../') + 'controller/controller.php')
		, type: 	(option.type 		|| 'POST')
		, dataType: (option.dataType 	|| 'text')
		, data: 	$.extend({}, usuario_Global, (option.param || {}))
		, error: 	erro
	}).done(function (data) { 
		processAjax_Global = false;
		data = data.replace(//g, '');

		if (typeof(option.done) == 'function') { 
			console.log('option.param');
			console.log(option.param);
			option.done(data, option.param);
		} else { 
			console.log('option.param');
			console.log(option.param);
			eval(option.done);
		}
	});
}

var funcListFila_Global = [];
function registerAjaxFunc(code) { 
	funcListFila_Global.push(code);
}

function observerAjaxFunc() { 
	if (funcListFila_Global.length > 0 && !processAjax_Global) { 
		try { 
			if (funcListFila_Global[0] == 'string') { 
				eval(funcListFila_Global[0]);
			} else {
				var func = funcListFila_Global[0];
				func();
			}
		} catch(e) { 
			console.error(e);
		}
		funcListFila_Global.splice(0,1);
	}
}
setInterval(function() { observerAjaxFunc(); }, 100);

function mudarPagina(el, divId, name, nameDiv) { 
	var elementoMenu = document.getElementsByName(name);
	var elementoContMenu = document.getElementsByName(nameDiv);
	for (var i = 0; i < elementoMenu.length; i++) {
		elementoMenu[i].className = "";
		elementoContMenu[i].style.display = "none";
	}
	$(el)[0].className = "active";
	$("#" + divId)[0].style.display = "block";
}

function capitalize(s) { 
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

function paramCapitalize(descricao) { 
	descricao = tirarAcentuacao((descricao || '')).toLowerCase().replace(/ /g , "_").replace(/-/g, "");
	descricao = descricao.split('');
	descricao[0] = descricao[0].toUpperCase();
	descricao = descricao.join('');
	return descricao;
}

function tirarAcentuacao(texto) { 
	var chars = [
		'áàãäâÃÂÁÀÄéèëêÉÈËÊíìïîÍÌÏÎóòôõöÕÔÓÒÖúùüûÚÙÜÛýÿÝñÑçÇ°º¹²³ÅÂž¡ËØŽƒ‰ŠÐ×—ß÷',
		'aaaaaAAAAAeeeeEEEEiiiiIIIIoooooOOOOOuuuuuuuuyyYnNcCoo123AAziEOZF%SDX-B/'
	]
	var char3 = '§´ª£¢¬¤¬©¨«°†¹®¶¢¼©€®’½µ¶¢™“¼„¢“¿±˜þ¾¯•‡„«';

	for (var i = 0; i < chars[0].length; i++) 
		texto = texto.replace( new RegExp(chars[0][i], 'g'), chars[1][i] );

	for (var i = 0; i < char3.length; i++) 
		texto = texto.replace( new RegExp(char3[i], 'g'), '' );

	texto = texto.replace(/œ/g, "AE");
	texto = texto.replace(/æ/g, "AE");
	texto = texto.replace(/Æ/g, "AE");
	texto = texto.replace(/™/g, "TM");
	texto = texto.replace(/…/g, "...");

	return texto;
}

function valorPorExtenso(valor) { 
	// Define as partes do valor por extenso
	var extenso = [];

	extenso[1] = 'um(a)';
	extenso[2] = 'dois(uas)';
	extenso[3] = 'tres';
	extenso[4] = 'quatro';
	extenso[5] = 'cinco';
	extenso[6] = 'seis';
	extenso[7] = 'sete';
	extenso[8] = 'oito';
	extenso[9] = 'nove';
	extenso[10] = 'dez';
	extenso[11] = 'onze';
	extenso[12] = 'doze';
	extenso[13] = 'treze';
	extenso[14] = 'quatorze';
	extenso[15] = 'quinze';
	extenso[16] = 'dezesseis';
	extenso[17] = 'dezessete';
	extenso[18] = 'dezoito';
	extenso[19] = 'dezenove';
	extenso[20] = 'vinte';
	extenso[30] = 'trinta';
	extenso[40] = 'quarenta';
	extenso[50] = 'cinquenta';
	extenso[60] = 'sessenta';
	extenso[70] = 'setenta';
	extenso[80] = 'oitenta';
	extenso[90] = 'noventa';
	extenso[100] = 'cem';
	extenso[200] = 'duzentos(as)';
	extenso[300] = 'trezentos(as)';
	extenso[400] = 'quatrocentos(as)';
	extenso[500] = 'quinhentos(as)';
	extenso[600] = 'seiscentos(as)';
	extenso[700] = 'setecentos(as)';
	extenso[800] = 'oitocentos(as)';
	extenso[900] = 'novecentos(as)';

	var restante = valor;
	var retorno = '';

	var trilhao = 	1000000000000,
		bilhao 	= 	1000000000,
		milhao 	= 	1000000;

	function getCentena(restante) { 
		var retorno = '';

		if (restante >= 100) { 
			var milhas = Math.trunc(restante / 100) * 100
			restante = restante - milhas;
			retorno += (retorno == '' ? '' : ' ') + (milhas === 1 ? 'cento' : extenso[milhas]);
			if (restante > 0) retorno += ' e';
		}

		if (restante >= 10) { 
			var milhas;
				 if (restante >= 20) milhas = Math.trunc(restante / 10) * 10;
			else if (restante <  19) milhas = restante;
			restante = restante - milhas;
			retorno += (retorno == '' ? '' : ' ') + extenso[milhas];
			if (restante > 0) retorno += ' e';
		}

		if (restante >= 1) { 
			var milhas = Math.trunc(restante / 1)
			restante = restante - milhas;
			retorno += (retorno == '' ? '' : ' ') + extenso[milhas];
			if (restante > 0) retorno += ' e';
		}
		return retorno;
	}

	var test;
	['tri','bi','mi'].forEach(function(pre) { 
		eval(`test = ${pre}lhao`);
		if (restante >= test) { 
			var tests = Math.trunc(restante / test) ;
			restante = restante - (tests * test);
			retorno += tests > 1 ? getCentena(tests) + ` ${pre}lhões` : extenso[tests] + ` ${pre}lhão`;
			if (restante > 0) retorno += ', ';
		}
	});

	if (restante >= 1000) { 
		var milhas = Math.trunc(restante / 1000)
		restante = restante - (milhas * 1000);
		retorno += getCentena(milhas) + ' mil';
		if (restante > 0) retorno += ', ';
	}
	retorno += getCentena(restante);
	return retorno;
}

function getRndInteger(min, max) { 
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function confirmModal(options) { 
	/*
		options: {
			msm: '' 				-- Mensagem a ser mostrada na tela
			done: function() {} 	-- Função disparada quando confirmar
			btnDesc: 'Confirmar' 	-- Descrição do botão de confirmação
			btnIcon: 'check' 		-- Icone do botão de confirmação
			btnClass: 'success' 	-- Class do botão de confirmação
		}
	*/
	var { done } = options;
	eval(''
		+ 	'done = function() { '
		+ 		'closeModal();'
		+ 		'var func = ' + String(done || function() {})
		+ 		';func();'
		+ 	'}'
	);

	openModal({
		head: options.msm,
		foot: resolvConfig({
			button: { 
				  desc: 	(options.btnDesc 	|| 'Confirmar')
				, icon: 	(options.btnIcon 	|| 'check')
				, class: 	'btn btn-' + (options.btnClass || 'success')
				, click: 	done
			}
		})
	});
}

function openModal(options) { 
	/*
		options: {
			head: '' 				-- Cabeçario do modal
			body: '' 				-- Corpo do modal
			foot: '' 				-- Rodapé do modal
			onOpen: function() 		-- Função executada quando abrir o modal
			onClose: function() 	-- Função executada quando fechar o modal
		}
	*/
	$("#modalGenerico").on('hidden.bs.modal', function() { onCloseModal(); });
	onCloseModal = (options.onClose || function() { });

	$("#modalHeadGenerico").html((options.head || ''));
	$("#modalBodyGenerico").html((options.body || ''))
		.css('display',((options.body || '') == '' ? 'none' : 'block'));
	$("#modalFootGenerico").html((options.foot || ''));

	if ($('#modalGenerico').is(':visible')) { 
		(options.onOpen || function() { $("#modalCloseGenerico")[0].focus(); })()
	} else { 
		$("#modalGenerico").on('shown.bs.modal', function() { onOpenModal(); });
		onOpenModal = (options.onOpen || function() { $("#modalCloseGenerico")[0].focus(); });

		$("#modalGenerico").modal('show');
	}
}
function onOpenModal() { }
function onCloseModal() { }

function closeModal() { 
	$("#modalGenerico").modal('hide');
}

function time2Int(time) { 
	if ((time || '') == '') time =  '00:00:00';
	time = time.split(':');
	var horas 	= parseInt(time[0]);
	var minuto 	= parseInt(time[1]);
	var segundo = parseInt(time[2]);
	return (horas * 3600) + (minuto * 60) + segundo;
}

function int2Time(value, rmDescimal=false) { 
	var horas = 0, minutos = 0, segundos = 0

	if (value >= 3600) {
		horas = parseInt(String(value / 3600).split('.')[0]);
		value -= horas * 3600;
	}

	if (value >= 60) {
		minutos = parseInt(String(value / 60).split('.')[0]);
		value -= minutos * 60;
	}
	horas 		= (horas 	< 10 ? '0' : '') + String(horas);
	minutos 	= (minutos 	< 10 ? '0' : '') + String(minutos);
	segundos 	= (value 	< 10 ? '0' : '') + String(value);

	if (isNaN(segundos)) segundos = '00';

	var result = horas + ':' + minutos + ':' + segundos;
	if (rmDescimal) result = result.split('.')[0];
	return result;
}

function orderArray(array, param='', paramSecond='') { 
	var dataTemp, verify;
	var paramE = param == '' 
		? 'array[i] < array[j]' 
		: `array[i]["${param}"] < array[j]["${paramSecond == '' ? param : paramSecond}"]`;

	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array.length; j++) {
			eval(`verify = ${paramE}`);

			if (verify) { 
				dataTemp = array[i];
				array[i] = array[j];
				array[j] = dataTemp;
			}
		}
	}
	return array;
}

var loaderBg_Global = '#11ACED';
var alertOld = alert;
setTimeout(function() { 
	alert = function(text, options={}) { 
		try {
			$.toast({
				heading: options.head || $(".titulo_pagina").html() || 'Aviso',
				text,
				showHideTransition: options.animation || 'slide',
				icon: options.icon || 'warning',
				position: options.position || "bottom-right",
				loaderBg: options.loaderBg || loaderBg_Global
			});
		} catch(e) { 
			// console.error(e);
			alertOld(text);
		}
	}
}, 500);

/**************************************************/
/** Operações Aplicação */
/**************************************************/
var paginaAtual_Global = '';
function abrirConteudo(el, titulo) { 
	$(".titulo_pagina").html(titulo);
	var arg = arguments;

	if (titulo == 'Principal') { 
		$(".breadcrumb").html(""
			+ "<li class='active'>Principal</li>"
		)
	} else {
		$(".breadcrumb").html(""
			+ "<li><a href='#' data-file='main' onclick='abrirConteudo(this, \"Principal\")'>Principal</a></li>"
			+ (arg.length < 2 ? '' : ""
				+ (function(args) { 
					var html = '';
					for (var i = args.length-1; i >= 2; i--) {
						html += ""
							+ "<li>"
							+ (args[i].split(',').length < 2 ? args[i].split(',')[0] : ''
								+ 	"<a href='#' data-file='" + args[i].split(',')[0] + "'"
								+ 		" onclick='abrirConteudo(this,\"" + args[i].split(',')[1] + "\""
								+ (i == 2 ? '' : ","
									+ (function(argsI, i) { 
										var htmlI = '';
										for (var j = i; j >= 2; j--) 
											htmlI += (htmlI == '' ? '' : ',') + "\"" + argsI[j] + "\"";
										return htmlI;
									}(args,(i-1)))
								)
								+		")'"
								+ 	">"
								+ 		args[i].split(',')[1]
								+ 	"</a>"
							)
							+ "</li>"
					}
					return html;
				}(arg))
			)
			+ "<li class='active'>" + titulo + "</li>"
		)
	}

	$("#conteudo_pagina").html(""
		+ "<img src='../img/carrega.gif'>"
	);

	if (["SuSE","Android","iOS","Windows Phone"].indexOf(platform.os.family) >= 0 &&
		$("body").attr('class').indexOf('sidebar-open') >= 0
	) { 
		$(".sidebar-toggle")[0].click();
	}

	var done = function(data) {
		$("#conteudo_pagina").html(''
			+ data.replace(/<\/\"\+\"script>/g, "</"+"script>")
			+ '<script>resolvImg();</'+'script>'
		);
	};
	var view = $(el).data('file'); 
	paginaAtual_Global = view;

	if ((window['isApp_Global'] || '') != '') { 
		getCtx(`${caminhoRequisicao}view/${view}.html`, view, done);
	} else {
		ajax({ // Carregar paginas da aplicação
			param: { 'loadView': true, view }, done
			, error: function() { alert('Não consegui carregar pagina!'); }
		});
	}
}

function resolvImg() { 
	var imgs = $('#conteudo_pagina').find("img");
	for (var i = 0; i < imgs.length; i++) { 
		imgs[i].onerror = function() { 
			if (this.src != 'error.jpg' && $(this).attr('src').indexOf(caminhoRequisicao) < 0) 
				this.src = ($(this).attr('src') || '').replace('../', caminhoRequisicao);
		}
	}
}

function logoff() { 
	if (!confirm('Deseja sair da aplicação?')) return false;
	localStorage.removeItem('usuario');
	window.location.assign('../index.html');
}

function initComponet() { 
	$("body").append(
		'<style>'
			+'h1 {'
				+'font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;'
				+'font-size: 24px; font-style: normal; font-variant: normal;font-weight: 700;'
				+'line-height: 26.4px; }'
			+'h3 {'
				+'font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;'
				+'font-size: 14px; font-style: normal; font-variant: normal; font-weight: 700;'
				+'line-height: 15.4px; }'
			+'p {'
				+'font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;'
				+'font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400;'
				+'line-height: 20px; }'
			+'blockquote {'
				+'font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;'
				+'font-size: 21px; font-style: normal; font-variant: normal; font-weight: 400;'
				+'line-height: 30px; }'
			+'pre {'
				+'font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;'
				+'font-size: 13px; font-style: normal; font-variant: normal; font-weight: 400;'
				+'line-height: 18.5714px; }'
		+'</style>'
		+ `<div class="modal fade" id="modalGenerico" role="dialog">`
		+ 	`<div class="modal-dialog">`
		+ 		`<div class="modal-content">`
		+ 			`<div class="modal-header">`
		+ 				`<button type="button" class="close" id="modalCloseGenerico" data-dismiss="modal">&times;</button>`
		+ 				`<h4 class="modal-title" id="modalHeadGenerico"></h4>`
		+ 			`</div>`
		+ 			`<div class="modal-body" id="modalBodyGenerico"></div>`
		+ 			`<div class="modal-footer">`
		+ 				`<span id="modalFootGenerico"></span>`
		+ 				`<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>`
		+ 			`</div>`
		+ 		`</div>`
		+ 	`</div>`
		+ `</div>`
	);

	// $(".foto-user").attr("src","../img/perfil/" + JSON.parse(localStorage.getItem('usuario')).ID_USUARIO + ".png");
	// $(".btn-logoff").attr('onclick', function(){ logoff(); });
	// $(".linkProduto")[0].onclick = function(){  }
	$('.sidebar-menu').tree();
	$(".nome_usuario").html(JSON.parse(localStorage.getItem('usuario')).NOME);
	$(".btn-logoff")[0].onclick = function(){ logoff(); }
	abrirConteudo($(document.createElement('span')).attr('data-file','main'),'Principal');


	var configPrincipal = { 
		param: { 'getConfigPrincipal': true },
		done: function(data) { 
			console.log(data);
			data = JSON.parse(data);
			console.log(data);

			$(".titulo_projeto").html(''
				+ ((data.logo_png || '') == '' ? '' : "<img src='../img/"+data.logo_png+".png' height='40px'> ")
				+ ((data.logo_png || '') != '' ? '' : (data.nome_projeto || ''))
			);
			$(".titulo_projeto_title").html((data.nome_projeto || ''));
			$(".titulo_projeto_mini").html(
				((data.logoMini_png 	|| '') != '' ? "<img src='../img/" + data.logoMini_png + ".png' height='40px'>" : ''
					+ ((data.logo_png 	|| '') == '' ? '' : "<img src='../img/" + data.logo_png + ".png' height='40px'>")
				)
			);

			if (((data.foot || {}).developer || '') != '') $("#developerFoot").html(data.foot.developer);
			if ((data.version || '') != '') $("#verionFoot").html(data.version);

			$("body").attr("class", $("body").attr("class") + " skin-" + (data['color-app'] || 'blue'))

			if ((data['color-teste_menu'] || '') != '')
				$(".navbar-static-top").css('color', data['color-teste_menu'])

			if ((data['color-nome_usuario'] || '') != '')
				$(".nome_usuario").css('color', data['color-nome_usuario'])

			loaderBg_Global = data['colorLoadAlert'] || '#11ACED';
		}
	}

	var menu = { 
		param: { 'getMenu': true },
		done: function(dataMenu) { 
			console.log(dataMenu);
			dataMenu = JSON.parse(dataMenu);
			console.log(dataMenu);
			$(".sidebar-menu").html( resolveMenu(dataMenu) );
		}
	}

	if ((window['isApp_Global'] || '') != '') { 
		getCtx(configPrincipal.param, 'configPrincipal', configPrincipal.done);
		getCtx(menu.param, 'menu', menu.done);

		importLib(caminhoRequisicao + "js/resolvConfig.full.js", 'RESOLV');
		// importLib(caminhoRequisicao + "principal/styleMap.css", 'styleMap');
		importLib(caminhoRequisicao + "principal/style.css", 'style');
		$(".main-footer")
			.css('position','fixed').css('bottom','0').css('width','100%')
			.html($(".main-footer").html().replace(' Todos os direitos reservados.',''));
		$("#developerFoot").css('color','#5bc0de');
		// initApp();
	} else { 
		ajax(configPrincipal);
		ajax(menu);
	}
}
