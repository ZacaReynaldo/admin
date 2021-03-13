var noSistema_Global = false;
setTimeout( function(){
	noSistema_Global = true;
}, 1000);

try { 
	var padraoParamReq_Global = { 
		'usuarioID': usuario_Global.usuarioID,
		'usuarioNome': usuario_Global.usuarioNome,
		'usuarioLogin': usuario_Global.usuarioLogin,
		'usuarioSenha': usuario_Global.usuarioSenha
	}
} catch(error) { /* window.location.assign('login.html'); */ }
var carrega = "<img src='lb/carrega.gif' width='60%'>";

// Funções particulares desse projeto
function viewRodape(op) { 
	switch(op) { 
		case 'hide': $("#rodape")[0].style.display = 'none';  break;
		case 'show': $("#rodape")[0].style.display = 'block'; break;
	}
}

var cameraOn_Global = false;
function onBackKeyDown() { 
	try { 
		if(cameraOn_Global) return (ocultarCamera(), QRScanner.destroy(function(){ }), false);
	} catch(error){ }

	try { // assistencia tec: caso esteja visulaiizando a imagem do agendamento 
		if(id('modalViewFoto').className != 'pswp') return (id('fecharModalViewFoto').click(), false);
	} catch(error){ }

	try { // assistencia tec: caso esteja em modo de assinatura volta a tela ao normal
		if ($('#botaoOperacao')[0].style.display == 'block' && $('#canvasObject')[0].style.display == 'block' && $('#assinaturaDiv')[0].style.display == 'block') 
			return ($("#cancelarAssinatura")[0].click(), false);
	} catch (error) { }

	var arrayModalTry = [ 
		{ modal: 'modalFotos', 					btnClose: 'closeModaFotos' 					}, // assistencia tec: fechar modal fotos 
		{ modal: 'modalDiagnostico', 			btnClose: 'closeModalDiagnostico' 			}, // assistencia tec: fechar modal diagnostico 
		{ modal: 'modalFuncionarioEsp', 		btnClose: 'closeModalFuncionarioEsp' 		}, // assistencia tec: fechar modal funcionario esp 
		{ modal: 'modalReagendamento', 			btnClose: 'closeModalReagendamento'			}, // assistencia tec: fechar modal de reagendamento
		{ modal: 'modalAvaliacaoFornecedor', 	btnClose: 'fecharModalIpBottun' 			}, // protocolo nf: fechar modal de avaliação do fornecedor 
		{ modal: 'modalFornecedor', 			btnClose: 'closeModalFornecedor' 			}, // protocolo nf: fechar modal de pesquisa de fornecedor 
		{ modal: 'modalItensPedido', 			btnClose: 'closeModalItensPedido' 			}, // protocolo nf: fechar modal de Itens do pedido
		{ modal: 'modalEncerramento', 			btnClose: 'closeModalEncerramento' 			}, // ferramenta: fechar modal de encerramento manual
		{ modal: 'modalTransferNota', 			btnClose: 'closeModalTransferNota' 			}, // ferramenta: fechar modal de tranferencia 
		{ modal: 'modalHistoricoFerramenta', 	btnClose: 'closeModalHistoricoFerramenta' 	}, // ferramenta: fechar modal do historico da ferramenta
		{ modal: 'modalAdicionaItem', 			btnClose: 'fecharModalIpBottun' 			}, // pré requi: fechar modal de adicionar itens
		{ modal: 'modalAlteraQtdProduto', 		btnClose: 'closeModalAlteraQtdProduto' 		}, // pré requi: fechar modal de alterar a quantidade do item
		{ modal: 'modalPesquisaOs', 			btnClose: 'closeModalPesquisaOs' 			}, // todos os modulos: fechar modal os 
	];
	for (var i = 0; i < arrayModalTry.length; i++) { 
		try { 
			if(id(arrayModalTry[i].modal).style.display == 'block') return (id(arrayModalTry[i].btnClose).click(), false);
		} catch(error) { }
	}

	try { // assistencia tec: caso esteja na aba editar volta para a aba de listagem dos agendamentos
		if (atendiEdit_Global != undefined && atendiEdit_Global) return(atendiEdit_Global = false, $("#ateHead")[0].click(), false);
	} catch(error) { }


	try { closeApp(); } catch(error){ window.history.back(); }
}

function setarValorCombo(eljson, id, value, descricao, accessKey, idValor, DescricaoValor, onblur, placeholder){
	$('#'+id).flexdatalist({
		selectionRequired: true,
		valueProperty: value,
		searchIn: descricao,
		minLength: 0,
		data: eljson
	});
	document.getElementById( id + "-flexdatalist").disabled = false;
	document.getElementById( id + "-flexdatalist").accessKey = accessKey;
	$("#" + id + "-flexdatalist").blur( onblur );
	document.getElementById( id + "-flexdatalist" ).placeholder = placeholder;

	if (idValor != 0 && DescricaoValor != "") { 
		document.getElementById( id ).value = idValor;
		document.getElementById( id + "-flexdatalist" ).value = DescricaoValor;
		$("#" + id + "-flexdatalist")[0].onfocus = function(){ viewRodape("hide"); }
		$("#" + id + "-flexdatalist")[0].onblur  = function(){ viewRodape("show"); }
	}
}

function rolagemPagina(opcoes) { 
	opcoes = $.extend( {}, {
		x: 			0,		// destino final eixo X
		y: 			0,		// destino final eixo Y
		duracao: 	50,		// tempo do ciclo
		px: 		100,	// condição inicial de quantos px ele move
		pxAdd: 		10,		// quantidade de px que será incrementada por ciclo
		operacao: 	"-",	// operação a a ser realizada
		velG: 		10		// velocidade de aumento entre cada ciclo
	} , opcoes);
	if (
		document.body.scrollTop  != opcoes.y || document.documentElement.scrollTop  != opcoes.y || 
		document.body.scrollLeft != opcoes.x || document.documentElement.scrollLeft != opcoes.x
	) {
		setTimeout(function(){
			var scrollLeftSet  = document.documentElement.scrollLeft - opcoes.px,
				scrollToSet    = opcoes.operacao == "-" ? document.documentElement.scrollTop - opcoes.px : 
				(scrollLeftSet = document.documentElement.scrollLeft + opcoes.px, document.documentElement.scrollTop  + opcoes.px);
			window.scrollTo(
				(scrollLeftSet < opcoes.x ? opcoes.x : scrollLeftSet),  /* set x */
				(scrollToSet   < opcoes.y ? opcoes.y : scrollToSet)     /* set y */
			);
			opcoes.px += opcoes.pxAdd;
			opcoes.duracao = (opcoes.duracao - opcoes.velG <= 0 ? 0 : opcoes.duracao - opcoes.velG);
			rolagemPagina(opcoes);
		}, opcoes.duracao);
	}
}

function logOut() { 
	// identificar se é navegador ou dispositivo movel, combra registro só quando dispositivo movel
	if(localStorage.getItem('NOTF') == '1'){
		// if((registroApp_Global || '') == '') return (alert('Falha, app não possui registro'), false);
		if(confirm("Deseja sair da aplicação?")){
			$.ajax({
				url: caminhoRequisicao + "lb/controllerNotificacao.php",
				type: 'POST',
				dataType: 'text',
				data:  $.extend({}, padraoParamReq_Global, { 'intivarRegistro': true, 'registro': registroApp_Global }),
				error: function(){ alert('Falha ao inativar registro do app!'); }
			}).done(function(data){
				console.log(data);
				localStorage.removeItem('registroPush');
				localStorage.removeItem("usuario_Global");
				console.log('logout')
				// window.location.assign("index.html");
			});
		}
	} else if(confirm("Deseja sair da aplicação?")){
		localStorage.removeItem("usuario_Global");
		console.log('logout2')
		// window.location.assign("index.html");
	}
}

// dispararTimeNotfi();
function dispararTimeNotfi() { 
	if(localStorage.NOTF){
		if(localStorage.getItem('NOTF') == '0'){
			try{
				var notifControl = document.getElementsByName('notifControl');
				for (var i = 0; i < notifControl.length; i++) notifControl[i].style.display = 'none';
			} catch(error){ }
		} else {
			console.log('dispararTimeNotfi');
			buscarNumNotifPendente();
			setInterval(function(){
				buscarNumNotifPendente();
			}, 5000);
		}
	}
}

function buscarNumNotifPendente() { 
	try{
		console.log('busca notiicacao');
		$.ajax({
			url: caminhoRequisicao + "lb/controllerNotificacao.php",
			type: 'POST',
			dataType: 'text',
			data:  $.extend({}, padraoParamReq_Global, { 'listarNumNotificacao': true }),
			// error: function(){ alert('Falha ao fazer requisição!'); }
			error: function(){
				console.log('Falha ao fazer requisição!');
				modoOffLine_Global = true;
			}
		}).done(function(data) {
			modoOffLine_Global = false;
			console.log(data);
			$("#numNotif").html(String(data) == '0' ? '' : data);
			// $("#numNotif").html(data);
		});
	} catch(error){ }
}



/*********************************************************************************************************************/
/*-----------------------------------------//** Separado Codigo **//*------------------------------------------------*/
/*********************************************************************************************************************/
// Funções Genericas Para Projetos
function editar(el) { 
	var id_cliente_unid_cons = $(el).data("id");
	$("#editar").val(id_cliente_unid_cons);
}

function editarId(id) { 
	$("#editar").val(id);
}

function n_editar() { 
	$("#editar").val(0);
	$("#fichaPesquisa").val(0);
}

function maius(obj) { obj.value = obj.value.toUpperCase(); }

function subirPagina() { 
	var html = document.documentElement;
	html.scrollLeft = 0;
	html.scrollTop = 0;
}

function pegarData() { 
	var now = new Date;
	var diaCerto = now.getDate();
	var mesCerto = now.getMonth() + 1;

	if (diaCerto < 10) 	diaCerto = "0" + diaCerto;
	if (mesCerto < 10) 	mesCerto = "0" + mesCerto;

	var dataAtual = now.getFullYear() + "-" + mesCerto + "-" + diaCerto;
	return dataAtual;
}

function pegarDataHora() { 
	var now = new Date;
	var diaCerto = now.getDate();
	var mesCerto = now.getMonth() + 1;

	if (diaCerto < 10) 	diaCerto = "0" + diaCerto;
	if (mesCerto < 10) 	mesCerto = "0" + mesCerto;

	var dataAtual = now.getFullYear()+"-"+mesCerto+"-"+diaCerto+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();  
	return dataAtual;
}

function formatarData(dataUN) { 
	// var anoCerto = dataUN[0].substring(2, 4);
	return (dataUN = dataUN.split("-"), dataUN[0] = dataUN[0].substring(2,4), dataUN.reverse().join('/')); // dataUN[2]+"/"+dataUN[1]+"/"+anoCerto;
}

function formatarDataHora(dataUN) { 
	dataUN = dataUN.split(" ");
	var data = dataUN[0].split("-"), tempo = dataUN[1].split(":");
	for(var i = 0; i < tempo.length; i++) tempo[i] = (parseInt(tempo[i]) < 10 ? "0" : "") + tempo[i];
	// var hora = tempo[0], minuto = tempo[1], segundo = tempo[2];
	// var anoCerto = dataUN[0].substring(2, 4);
	return (data[0] = data[0].substring(2,4), data.reverse().join('/')+" "+tempo.join(':')); // hora+":"+minuto+":"+segundo;
}

function ultimoDiaMes(data) { 
	if(data = data.split('-'), data.length > 1) 
		var mes = data[0].length == 4 || data.length == 3 ? parseInt(data[1]) : parseInt(data[0]);
	else 
		var mes = function(data){
			return data[1].length < 4 || data.length == 3 ? parseInt(data[1]) : parseInt(data[0]);
		}(data = data.join('-'), data.split('/'));

	var meses = [1,3,5,7,8,10,12];
	return meses.indexOf(mes) != -1 ? '31' : (meses = [4,6,9,11], meses.indexOf(mes) != -1 ? '30' : '28');
}

function formataValorParaCalcular(valor) { 
	return  valor = String(valor),
			valor = valor.replace("R$", ""),
			// valor = valor.replace(".", ""),
			valor = valor.replace(" ", ""),
			valor = valor.replace(",", ""),
			valor = parseFloat(valor),
			valor.toFixed(2);
}

function formataValorParaCalcular2(valor) { 
	return  valor = String(valor),
			valor = valor.replace("R$", ""),
			valor = valor.replace(".", ""),
			valor = valor.replace(" ", ""),
			valor = valor.replace(",", "."),
			valor = parseFloat(valor),
			valor.toFixed(2);
}

function formataValorParaImprimir(valor) { 
	valor = parseFloat(valor);
	valor = moeda(valor , 2 , "," , ".");
	//valor = valor.toFixed(2);
	//valor = valor.replace(".", ",");
	valor = "R$"+valor;
	return valor;
}

function formatarValorParaDecimal(valor) { 
	valor = parseFloat(valor);
	valor = valor.toFixed(2);
	valor = valor.replace(".", ",");
	// valor = "R$ "+valor;
	return valor;
}

function formataValorParaQuantidade(valor) { 
	valor = parseFloat(valor);
	valor = valor.toFixed(3);
	valor = valor.replace(".",",");
	return valor;
}

function formataZeroEsquerda(valor, total) { 
	if(valor == "") return "";
	var casas = String(total).length, zeros = "";
	for (var i = 0; i < casas; i++) zeros += "0";
	var valorS = zeros + String(valor);
	return valorS.substring((valorS.length - casas), valorS.length);
}

function moeda(valor, casas, separdor_decimal, separador_milhar) { 
 	var valor_total = parseInt(valor * (Math.pow(10,casas)));
	var inteiros =  parseInt(parseInt(valor * (Math.pow(10,casas))) / parseFloat(Math.pow(10,casas)));
	var centavos = parseInt(parseInt(valor * (Math.pow(10,casas))) % parseFloat(Math.pow(10,casas)));
	
	if(centavos % 10 == 0 && centavos + "".length < 2){
		centavos = centavos+"0";
	} else if(centavos < 10){
		centavos = "0" + centavos;
	}
	var milhares = parseInt(inteiros/1000);
	inteiros = inteiros % 1000; 
	var retorno = "";
	if(milhares>0){
		retorno = milhares+""+separador_milhar+""+retorno
		if(inteiros == 0){
			inteiros = "000";
		} else if(inteiros < 10){
			inteiros = "00"+inteiros; 
		} else if(inteiros < 100){
			inteiros = "0"+inteiros; 
		}
	}
	retorno += inteiros+""+separdor_decimal+""+centavos;	
	return retorno;
}

function mask() { 
	jQuery(function($){
		$('.cpf').mask("999.999.999-99");
		$('.rg').mask("aa-99.999.999");
		$('.cnpj').mask("99.999.999/9999-9");
		$('.telefone').mask("(99) 9999-9999");
		$('.celular').mask("(99) 9 9999-9999");
		$('.cep').mask("99.999-999");
		/* Personalizadas */
		$('.funcionario').mask("99999-9");
	});

	/*$.mask.definitions['H'] = "[0-2]";
	$.mask.definitions['h'] = "[0-9]";
	$.mask.definitions['O'] = "[0-5]";
	$.mask.definitions['m'] = "[0-9]";

	$("input[rel=data], input[data-mask=data]").mask("99/99/9999");
	$("input[data-mask=ano]").mask("9999");
	$("input[rel=hora], input[data-mask=hora]").mask("Hh:Om");
	$("input[rel=minutos], input[data-mask=minutos]").mask("99?9M");
	$("input[rel=placa], input[data-mask=placa]").mask("aaa-9999");
	$("input[rel=cpf], input[data-mask=cpf]").mask("999.999.999-99");
	$("input[rel=cnpj], input[data-mask=cnpj]").mask("99.999.999/9999-99");
	$("input[rel=cei], input[data-mask=cei]").mask("99.9999999.99-99");
	$("input[rel=ncm], input[data-mask=ncm]").mask("9999.99.99");
	$("input[rel=cest], input[data-mask=cest]").mask("99.9999.99");
	$("input[rel=cnae], input[data-mask=cnae]").mask("9999-9.99");
	$("input[rel=planoDeContas], input[data-mask=planoDeContas]").mask("9.9.99.99.99");
	$("input[rel=cep], input[data-mask=cep]").mask("99999-999");
	$("input[rel=ean], input[data-mask=ean]").mask("9999999999999");
	
	/* Personalizados */
	/*$("input[rel=funcionario], input[data-mask=funcionario]").mask("99999-9");

	$("input[rel=quantidade], input[data-mask=quantidade]").maskMoney({showSymbol: false, precision: 4, decimal: ",", thousands: ""});
	$("input[rel=porcento], input[data-mask=porcento]").maskMoney({showSymbol: true, symbol:"%" , decimal: ",", thousands: ""});
	$("input[rel=decimalGeral], input[data-mask=decimalGeral]").maskMoney({showSymbol: true, symbol:"" , decimal: ",", thousands: ""});
	$("input[rel=dinheiro], input[data-mask=dinheiro]").maskMoney({showSymbol: true, symbol: "R$", decimal: ",", thousands: ""});
	$("input[rel=peso4dec], input[data-mask=peso4dec]").maskMoney({showSymbol: false, precision: 4, decimal: ",", thousands: "."});

	$("input[data-mask=num1dec]").maskMoney({showSymbol: false, precision: 1, decimal: ",", thousands: "."});
	$("input[data-mask=num2dec]").maskMoney({showSymbol: false, precision: 2, decimal: ",", thousands: "."});
	$("input[data-mask=num3dec]").maskMoney({showSymbol: false, precision: 3, decimal: ",", thousands: "."});
	$("input[data-mask=num4dec]").maskMoney({showSymbol: false, precision: 4, decimal: ",", thousands: "."});

	$("input[rel=telefone], input[rel=celular], input[data-mask=telefone], input[data-mask=celular]").focusout(function () {
		var phone, element;
		element = $(this);
		element.unmask();
		phone = element.val().replace(/\D/g, '');
		if (phone.length > 10) {
			element.mask("(99) 99999-999?9");
		} else {
			element.mask("(99) 9999-9999?9");
		}
	}).trigger('focusout');

	$("input[rel=telefone_sem_ddd], input[rel=celular], input[data-mask=telefone_sem_ddd], input[data-mask=celular]").focusout(function () {
		var phone, element;
		element = $(this);
		element.unmask();
		phone = element.val().replace(/\D/g, '');
		if (phone.length > 10) {
			element.mask("99999-999?9");
		} else {
			element.mask("9999-9999?9");
		}
	}).trigger('focusout');*/
}

function maiuscula(z) { return z.toUpperCase(); }

function removerEspacoDuplo(descricao) { return removerCharDup(descricao); }

function removerCharDup(descricao) { 
	var carcteres = "abcdefghijklmnopqrstuvwxyz 1234567890!@#$%¨&_,.<>;/:°ºª§¹²³£¢¬|"; 
				 // 'abcdefghijklmnopqrstuvwxyz 1234567890!@#$%¨&_,.<>;/:°ºª§¹²³£¢¬|'; *()+=-[]{}?`^´~
	/** Retirar campos duplos de uma descrição para valida-la melhor */
	while(descricao.indexOf("  ")   != -1) descricao = descricao.replace(/  /g, " ");
	while(descricao.indexOf("\'\'") != -1) descricao = descricao.replace(/\'\'/g, "\'");
	while(descricao.indexOf("\"\"") != -1) descricao = descricao.replace(/\"\"/g, "\"");
	while(descricao.indexOf("\\\\") != -1) descricao = descricao.replace(/\\\\/g, "\\");
	var substituir, char = '', caracteresTri = 'o', caracteresNot = '1234567890';
	for (var i = 0; i < carcteres.length; i++) {
		substituir = (char = carcteres[i]) + char;
		if(caracteresNot.indexOf(char) == -1){
			if(caracteresTri.indexOf(char) != -1) substituir = char + (char = substituir);
			while(descricao.indexOf(substituir) != -1) descricao = descricao.replace(new RegExp(substituir,"gi"), char);
		}
	}
	return descricao;
}

function padraoResultadoJson(dados) { return (dados = JSON.parse(dados), log(dados), dados); }
function log(data) { console.log(data); }
function id(id) { return document.getElementById(id); }

function tirarAcentuacao(texto) { 
	texto = texto.replace(/á/g, "a");
	texto = texto.replace(/à/g, "a");
	texto = texto.replace(/ã/g, "a");
	texto = texto.replace(/ä/g, "a");
	texto = texto.replace(/â/g, "a");
	texto = texto.replace(/Ã/g, "A");
	texto = texto.replace(/Â/g, "A");
	texto = texto.replace(/Á/g, "A");
	texto = texto.replace(/À/g, "A");
	texto = texto.replace(/Ä/g, "A");
	texto = texto.replace(/é/g, "e");
	texto = texto.replace(/è/g, "e");
	texto = texto.replace(/ë/g, "e");
	texto = texto.replace(/ê/g, "e");
	texto = texto.replace(/É/g, "E");
	texto = texto.replace(/È/g, "E");
	texto = texto.replace(/Ë/g, "E");
	texto = texto.replace(/Ê/g, "E");
	texto = texto.replace(/í/g, "i");
	texto = texto.replace(/ì/g, "i");
	texto = texto.replace(/ï/g, "i");
	texto = texto.replace(/î/g, "i");
	texto = texto.replace(/Í/g, "I");
	texto = texto.replace(/Ì/g, "I");
	texto = texto.replace(/Ï/g, "I");
	texto = texto.replace(/Î/g, "I");
	texto = texto.replace(/ó/g, "o");
	texto = texto.replace(/ò/g, "o");
	texto = texto.replace(/ô/g, "o");
	texto = texto.replace(/õ/g, "o");
	texto = texto.replace(/ö/g, "o");
	texto = texto.replace(/Õ/g, "O");
	texto = texto.replace(/Ô/g, "O");
	texto = texto.replace(/Ó/g, "O");
	texto = texto.replace(/Ò/g, "O");
	texto = texto.replace(/Ö/g, "O");
	texto = texto.replace(/ú/g, "u");
	texto = texto.replace(/ù/g, "u");
	texto = texto.replace(/ü/g, "u");
	texto = texto.replace(/û/g, "u");
	texto = texto.replace(/Ú/g, "u");
	texto = texto.replace(/Ù/g, "u");
	texto = texto.replace(/Ü/g, "u");
	texto = texto.replace(/Û/g, "u");
	texto = texto.replace(/ý/g, "y");
	texto = texto.replace(/ÿ/g, "y");
	texto = texto.replace(/Ý/g, "Y");
	texto = texto.replace(/ñ/g, "n");
	texto = texto.replace(/Ñ/g, "N");
	texto = texto.replace(/ç/g, "c");
	texto = texto.replace(/Ç/g, "C");


	texto = texto.replace(/§/g, "");
	texto = texto.replace(/´/g, "");
	texto = texto.replace(/ª/g, "");
	texto = texto.replace(/£/g, "");
	texto = texto.replace(/¢/g, "");
	texto = texto.replace(/¬/g, "");
	texto = texto.replace(/¤/g, "");

	
	texto = texto.replace(/°/g, "o");
	texto = texto.replace(/º/g, "o");
	texto = texto.replace(/¹/g, "1");
	texto = texto.replace(/²/g, "2");
	texto = texto.replace(/³/g, "3");


	texto = texto.replace(/Å/g, "A");
	texto = texto.replace(/Â/g, "A");
	texto = texto.replace(/ž/g, "z");
	texto = texto.replace(/¡/g, "i");
	texto = texto.replace(/Ë/g, "E");
	texto = texto.replace(/œ/g, "AE");
	texto = texto.replace(/Ø/g, "O");
	texto = texto.replace(/æ/g, "AE");
	texto = texto.replace(/™/g, "TM");
	texto = texto.replace(/Ž/g, "Z");
	texto = texto.replace(/ƒ/g, "F");
	texto = texto.replace(/Æ/g, "AE");
	texto = texto.replace(/‰/g, "%");
	texto = texto.replace(/Š/g, "S");
	texto = texto.replace(/…/g, "...");
	texto = texto.replace(/Ð/g, "D");
	texto = texto.replace(/×/g, "X");
	texto = texto.replace(/—/g, "-");
	texto = texto.replace(/ß/g, "B");

	texto = texto.replace(/®/g, "");
	texto = texto.replace(/¶/g, "");
	texto = texto.replace(/¢/g, "");
	texto = texto.replace(/¼/g, "");
	texto = texto.replace(/©/g, "");
	texto = texto.replace(//g, "");
	texto = texto.replace(/€/g, "");
	texto = texto.replace(//g, "");
	texto = texto.replace(/¬/g, "");
	texto = texto.replace(/©/g, "");
	texto = texto.replace(/¨/g, "");
	texto = texto.replace(/«/g, "");
	texto = texto.replace(/°/g, "");
	texto = texto.replace(/†/g, "");
	texto = texto.replace(/¹/g, "");

	texto = texto.replace(/®/g, "");
	texto = texto.replace(//g, "");
	texto = texto.replace(/’/g, "");
	texto = texto.replace(//g, "");
	texto = texto.replace(/½/g, "");
	texto = texto.replace(/µ/g, "");
	texto = texto.replace(/¶/g, "");
	texto = texto.replace(/¢/g, "");
	texto = texto.replace(//g, "");
	texto = texto.replace(/™/g, "");
	texto = texto.replace(/“/g, "");
	texto = texto.replace(/¼/g, "");
	texto = texto.replace(/„/g, "");
	texto = texto.replace(/¢/g, "");
	texto = texto.replace(/“/g, "");
	texto = texto.replace(/¿/g, "");
	texto = texto.replace(//g, "");
	texto = texto.replace(/±/g, "");
	texto = texto.replace(/˜/g, "");
	texto = texto.replace(/÷/g, "/");
	texto = texto.replace(/þ/g, "");
	texto = texto.replace(/¾/g, "");
	texto = texto.replace(/¯/g, "");
	texto = texto.replace(/•/g, "");
	texto = texto.replace(/‡/g, "");
	texto = texto.replace(/„/g, "");
	texto = texto.replace(/«/g, "");

	texto = texto.replace(/”/g, "\"");


	/*  Notepad++ */

	texto = texto.replace(/Ã¡/g, "a");
	texto = texto.replace(/Ã /g, "a");
	texto = texto.replace(/Ã£/g, "a");
	texto = texto.replace(/Ã¤/g, "a");
	texto = texto.replace(/Ã¢/g, "a");
	texto = texto.replace(/Ã/g, "A");
	texto = texto.replace(/Ã/g, "A");
	texto = texto.replace(/Ã/g, "A");
	texto = texto.replace(/Ã/g, "A");
	texto = texto.replace(/Ã/g, "A");
	texto = texto.replace(/Ã©/g, "e");
	texto = texto.replace(/Ã¨/g, "e");
	texto = texto.replace(/Ã«/g, "e");
	texto = texto.replace(/Ãª/g, "e");
	texto = texto.replace(/Ã/g, "E");
	texto = texto.replace(/Ã/g, "E");
	texto = texto.replace(/Ã/g, "E");
	texto = texto.replace(/Ã/g, "E");
	texto = texto.replace(/Ã­/g, "i");
	texto = texto.replace(/Ã¬/g, "i");
	texto = texto.replace(/Ã¯/g, "i");
	texto = texto.replace(/Ã®/g, "i");
	texto = texto.replace(/Ã/g, "I");
	texto = texto.replace(/Ã/g, "I");
	texto = texto.replace(/Ã/g, "I");
	texto = texto.replace(/Ã/g, "I");
	texto = texto.replace(/Ã³/g, "o");
	texto = texto.replace(/Ã²/g, "o");
	texto = texto.replace(/Ã´/g, "o");
	texto = texto.replace(/Ãµ/g, "o");
	texto = texto.replace(/Ã¶/g, "o");
	texto = texto.replace(/Ã/g, "O");
	texto = texto.replace(/Ã/g, "O");
	texto = texto.replace(/Ã/g, "O");
	texto = texto.replace(/Ã/g, "O");
	texto = texto.replace(/Ã/g, "O");
	texto = texto.replace(/Ãº/g, "u");
	texto = texto.replace(/Ã¹/g, "u");
	texto = texto.replace(/Ã¼/g, "u");
	texto = texto.replace(/Ã»/g, "u");
	texto = texto.replace(/Ã/g, "u");
	texto = texto.replace(/Ã/g, "u");
	texto = texto.replace(/Ã/g, "u");
	texto = texto.replace(/Ã/g, "u");
	texto = texto.replace(/Ã½/g, "y");
	texto = texto.replace(/Ã¿/g, "y");
	texto = texto.replace(/Ã/g, "Y");
	texto = texto.replace(/Ã±/g, "n");
	texto = texto.replace(/Ã/g, "N");
	texto = texto.replace(/Ã§/g, "c");
	texto = texto.replace(/Ã/g, "C");
	
	texto = texto.replace(/Â§/g, "");
	texto = texto.replace(/Â´/g, "");
	texto = texto.replace(/Âª/g, "");
	texto = texto.replace(/Â£/g, "");
	texto = texto.replace(/Â¢/g, "");
	texto = texto.replace(/Â¬/g, "");
	texto = texto.replace(/Â¤/g, "");

	texto = texto.replace(/Âº/g, "^0");
	texto = texto.replace(/Â°/g, "^0");
	texto = texto.replace(/Â¹/g, "^1");
	texto = texto.replace(/Â²/g, "^2");
	texto = texto.replace(/Â³/g, "^3");
	
	return texto;
}
