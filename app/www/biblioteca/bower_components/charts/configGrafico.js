var chart = "";
var dadosGraficos_Global = [];
var indice_dadosGraficos_Global = 0;
var graficoSeledcionado = "";
var clickDown_Global = false;
var oldObjetc = -1, newObject = -1;
var tooltipModel_Global = {};
var vezSet = 0;
var indicePag = 0;
var setarGrafico_Global = false;
var grafico_subsequente_Global = "";
var graficoAtual_GLobal = "";
var graficoOld_Global = "";
var set_vezes_Global = 0;
var grafcioImpedido_Global = false;
var zerarPaginacao_Global = true;
var barraProgresso_Global = 'barraProgresso';

var ticksOption = { 
	// Include a dollar sign in the ticks
	callback: function (value, index, values) {
		var mostrar = false;
		if(mostrar) console.log(index+values);
		return '' + value;
	},
	// min: 0,
	// max: 13
}

// Customiza a caixa de dialogo que aparece quando passa o mause por cima ou qunado clica
var customTooltips = function (tooltipModel) { 
	// console.log(tooltipModel_Global);
	// var tipo = tooltipModel_Global.tipo == undefined ? true : false;
	tooltipModel_Global = tooltipModel;
	/* configurações padrão */
	var tooltipEl = document.getElementById('chartjs-tooltip');
	if(!tooltipEl){tooltipEl=document.createElement('div');tooltipEl.id='chartjs-tooltip';tooltipEl.innerHTML="<table></table>";document.body.appendChild(tooltipEl);}
	if(tooltipModel.opacity===0){tooltipEl.style.opacity=0;return;}
	tooltipEl.classList.remove('above', 'below', 'no-transform');
	if(tooltipModel.yAlign){tooltipEl.classList.add(tooltipModel.yAlign);}
	else{tooltipEl.classList.add('no-transform');}
	function getBody(bodyItem) { return bodyItem.lines; }
	/* contrói o objeto que mostra quando clica na barra ou na linha */
	if (tooltipModel.body) {
		/* dados especificos da coluna em que passa o mouse em cima */
		// var dados = dadosGraficos_Global[indice_dadosGraficos_Global].datasets[tooltipModel.dataPoints[0].datasetIndex].dados[tooltipModel.dataPoints[0].index];
		newObject = tooltipModel.dataPoints[0].index;
		var innerHtml = callbacksTooltips(tooltipModel.dataPoints[0].datasetIndex, tooltipModel.dataPoints[0].index);
		if(innerHtml != 0){
			// var label = dadosGraficos_Global.datasets[tooltipModel.dataPoints[0].datasetIndex].label;
			// var titleLines = tooltipModel.title || [];
			// var bodyLines = tooltipModel.body.map(getBody);
			/** faz a validação do clique encima da barra ou linha que se deseja visulizar ou ocultar os dados */
			var tableRoot = tooltipEl.querySelector('table');
			// if (newObject == oldObjetc) {
			clickDown_Global = newObject == oldObjetc ? (clickDown_Global ? false : true) : true;
			// } else {
				// clickDown_Global = ;
			// }
			if (clickDown_Global) {
				$("#chartjs-tooltip").css('display', 'block');
				tableRoot.innerHTML = innerHtml;
			} else {
				$("#chartjs-tooltip").css('display', 'none');
			}
			oldObjetc = tooltipModel.dataPoints[0].index;
		} else {
			$("#chartjs-tooltip").css('display', 'none');
		}
	}
	// `this` will be the overall tooltip
	var position = this._chart.canvas.getBoundingClientRect();
	// Display, position, and set styles for font
	tooltipEl.style.opacity = 1;
	tooltipEl.style.position = 'absolute';
	try{
		if(tooltipEl.style.width == ''){
			tooltipEl.style.left = (position.left + tooltipModel.caretX) + 'px';
		} else {
			var widthTooltipEl = parseFloat(tooltipEl.style.width.replace('px', ''));
			if(widthTooltipEl == 0 || widthTooltipEl == NaN || widthTooltipEl == undefined || widthTooltipEl == 'NaN' || widthTooltipEl == ''){
				tooltipEl.style.left = (position.left + tooltipModel.caretX) + 'px';
			} else {
				tooltipEl.style.left = ((widthTooltipEl / 2) < (position.left + tooltipModel.caretX) ? (position.left + tooltipModel.caretX) : (widthTooltipEl / 2)) + 'px';
			}
		}
		// console.log('tamanho div: ' + (widthTooltipEl / 2) + '\nespaçamento a direita: ' + (position.left + tooltipModel.caretX));
	} catch(erro){
		// console.log('erro compara width da div com caretX');
		tooltipEl.style.left = (position.left + tooltipModel.caretX) + 'px';
	}
	tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
	tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
	tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
	tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
	// var left = parseFloat(tooltipEl.style.left.replace("px", ""));
	// tooltipEl.style.left = (parseFloat(tooltipEl.style.left.replace("px", "")) < (position.left + tooltipModel.caretX) ) ? '250px' : tooltipEl.style.left;
	// tooltipEl.style.left = '0px';
}

// Coloca os dados do grafico emcima da linha ou da coluna dependendo do grafico
Chart.plugins.register( { 
	afterDatasetsDraw: function (chart) {
		var ctx = chart.ctx;

		chart.data.datasets.forEach(function (dataset, i) {
			// console.log(dataset);
			if (dataset.visivel) {
				var meta = chart.getDatasetMeta(i);
				if (!meta.hidden) {
					meta.data.forEach(function (element, index) {
						try{
							// Draw the text in black, with the specified font
							ctx.fillStyle = 'rgb(0, 0, 0)';
							/*console.log(dataset);
							console.log(dataset.data);
							console.log(dataset.data[index]);
							console.log(dataset.data[index].toString());*/
							var fontSize = 15;
							var fontStyle = 'normal';
							var fontFamily = 'Calibri'; //Helvetica Neue';
							ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
							// Just naively convert to string for now
							var menorQZero = dataset.verificaMenorZero ? 
										(parseInt(dataset.data[index].toString()) > 0 || parseInt(dataset.data[index].toString()) <= -1.9 ? true : false ) : true;
							var dataString = "";
							if (dataset.data[index].toString() != 'NaN' && menorQZero) {
								if (dataset.referenciaDados == 'data' || dataset.dados[index].VALOR_PADRAO == undefined) {
									dataString = prefixoTooltips + dataset.data[index].toString() + sufixoTooltips;
								} else {
									dataString = prefixoTooltips + dataset.dados[index].VALOR_PADRAO + sufixoTooltips;
								}
								/*var 								cond = 0; // Mostar sem autenticar
								if(dataset.min != undefined){
									if(dataset.max != undefined) 	cond = 3; // Autenticar valores min e max
									else 							cond = 1; // Autentica somente valor min
								} else if(dataset.max != undefined)	cond = 2; // Autentica somente valor max
	
								switch(cond){
									case 0: 
										dataString = prefixoTooltips + dataset.data[index].toString() + sufixoTooltips; 
										break;
									case 1: 
										dataString = dataset.min <= parseInt(dataset.data[index]) ? 
											prefixoTooltips + dataset.data[index].toString() + sufixoTooltips : ""; 
										break;
									case 2: 
										dataString = dataset.max >= parseInt(dataset.data[index]) ? 
											prefixoTooltips + dataset.data[index].toString() + sufixoTooltips : ""; 
										break;
									case 3: 
										dataString = dataset.min <= parseInt(dataset.data[index]) && dataset.max >= parseInt(dataset.data[index]) ? 
											prefixoTooltips + dataset.data[index].toString() + sufixoTooltips : ""; 
										break;
								}*/
							}
							// Make sure alignment settings are correct
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
	
							var padding = 5;
							var position = element.tooltipPosition();
							ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
						} catch(error){
							console.error(error);
						}
					});
				}
			}
		});
	}
});
var defaultLegendClickHandler = Chart.defaults.global.legend.onClick;

/* renderizar o grafico */
function renderGrafico(option) { 
	option = $.extend({}, { div: "id_div", canvas: "myChart", indice: 0, html: "", descricao: "", buttonPag: "btnPaginaGraf" }, option);
	graficoOld_Global = option.descricao;
	var ctx = "", datasetsEq = [], labelsEq = [], dadosEq = [];
	var dadosGraficos = dadosGraficos_Global[option.indice];

	/** Especifica os valor minimo e maximo do gráfico */
	if(dadosGraficos.min != undefined) ticksOption.min = dadosGraficos.min;
	if(dadosGraficos.max != undefined) ticksOption.max = dadosGraficos.max;
	if(dadosGraficos.monotone != undefined) ticksOption.cubicInterpolationMode = 'monotone'; /** Linha um pouco mais quadradas */
	if(dadosGraficos.boolDatasetsArrayColor == '1') {
		for (var i = 0; i < dadosGraficos.datasets.length; i++) {
			if (typeof(dadosGraficos.datasets[i].backgroundColor) == "array") {
				dadosGraficos.datasets[i].backgroundColor.join(',');
			}
			dadosGraficos.datasets[i].backgroundColor = dadosGraficos.datasets[i].backgroundColor.split(',');
			dadosGraficos.datasets[i].borderColor = dadosGraficos.datasets[i].borderColor.split(',');
		}
	}

	$("#" + option.div).html("");
	$("#" + option.div).html(option.html + "<canvas id=\"" + option.canvas + "\" style=\"border-style: none;\"></canvas>");
	// console.log(option.canvas);
	ctx = document.getElementById(option.canvas).getContext('2d');

	/** Define a altura do gráfico */
	if(dadosGraficos.alturaGrafico != "auto"){
		if(dadosGraficos.alturaGrafico.indexOf('%')){
			$("#" + option.canvas).css('height', window.innerHeight * parseInt(dadosGraficos.alturaGrafico.replace('%')) / 100 );
		} else {
			$("#" + option.canvas).css('height', dadosGraficos.alturaGrafico);
		}
		$("#" + option.canvas).css('width', '100%');
	} 

	/* Paginação do gráfico */
	if(zerarPaginacao_Global){ indicePag = 0; zerarPaginacao_Global = false; }
	if(dadosGraficos.paginacao != undefined && dadosGraficos.paginacao < dadosGraficos.dadosTotal[0].data.length){
		// dadosGraficos.indiceDataSet
		for (var i = indicePag; i < indicePag + dadosGraficos.paginacao; i++) {
			labelsEq.push(dadosGraficos.labelTotal[i]);
			dadosEq.push(dadosGraficos.dadosTotal[0].dados[i]);
		}
		dadosGraficos.labels = labelsEq;

		for(var indiceDataSet = 0; indiceDataSet < dadosGraficos.dadosTotal.length; indiceDataSet++){
			datasetsEq = [];
			for (var i = indicePag; i < indicePag + dadosGraficos.paginacao; i++) {
				datasetsEq.push(dadosGraficos.dadosTotal[indiceDataSet].data[i]);
			}
			dadosGraficos.datasets[indiceDataSet].data = datasetsEq;
			dadosGraficos.datasets[indiceDataSet].dados = dadosEq;
	
			var dadosTotal = dadosGraficos.dadosTotal[indiceDataSet].data.length, porcentagem = 0;
			if((indicePag + dadosGraficos.paginacao) == dadosTotal) 	porcentagem = 100;
			else if(indicePag == 0) 									porcentagem = 0;
			else  														porcentagem = (indicePag + parseInt(dadosGraficos.paginacao / 2)) * 100 / dadosTotal;
	
			try{ $("#" + barraProgresso_Global).css('width', (porcentagem) + '%'); } catch(error){}
			try{
				var btnPaginaGraf = document.getElementsByName(option.buttonPag);
				for (var i = 0; i < btnPaginaGraf.length; i++) { btnPaginaGraf[i].disabled = false; }
			} catch(error) { console.error(error); }
		}
	} else if(dadosGraficos.paginacao != undefined){
		try{
			var btnPaginaGraf = document.getElementsByName(option.buttonPag);
			for (var i = 0; i < btnPaginaGraf.length; i++) { btnPaginaGraf[i].disabled = true; }
		} catch(error) { console.error(error); }
	} else {
		try{
			var btnPaginaGraf = document.getElementsByName(option.buttonPag);
			for (var i = 0; i < btnPaginaGraf.length; i++) { btnPaginaGraf[i].disabled = false; }
		} catch(error) { console.error(error); }
	}

	// console.log(dadosGraficos);

	ctx = document.getElementById(option.canvas).getContext('2d');
	var chart = new Chart(ctx, {
		/* tipo do graficos de linha, barra, pizza... */
		// type: 'line',
		type: dadosGraficos.type,
		/* dados do graficoss */
		data: dadosGraficos,
		// plugins: [{
			// afterDatasetsDraw: afterDatasetsDraw
		// }]
		/* configurções gerais */
		options: {
			events: ['click'],
			onClick: function(){
				/** Faz configuração do click no elemento chamando novamente a função de mostrar dados aicionais ao elemento */
				tooltipModel_Global.tipo = "click";
				try{ indice_dadosGraficos_Global = option.indice; customTooltips(tooltipModel_Global); }
				catch(error){ /* faz nada */ }
			},
			scales: dadosGraficos.pie ? {} : 
				(dadosGraficos.scales == undefined ? 
					{
						xAxes: [{ display: true, scaleLabel: { display: true, labelString: (dadosGraficos.xAxes != undefined ? dadosGraficos.xAxes : "")} }],
						yAxes: [{ display: true, scaleLabel: { display: true, labelString: (dadosGraficos.yAxes != undefined ? dadosGraficos.yAxes : "")}, ticks: ticksOption }]
						// yAxes:[{ticks: ticksOption}]
					} : 
					(dadosGraficos.scales == "stacked" ?  {
						xAxes: [{ stacked: true, scaleLabel: { display: true, labelString: (dadosGraficos.xAxes != undefined ? dadosGraficos.xAxes : "")} }],
						yAxes: [{ stacked: true, scaleLabel: { display: true, labelString: (dadosGraficos.yAxes != undefined ? dadosGraficos.yAxes : "")}, ticks: ticksOption }] 
					} : {
						xAxes: [{ display: true, scaleLabel: { display: true, labelString: (dadosGraficos.xAxes != undefined ? dadosGraficos.xAxes : "")} }],
						yAxes: [{ display: true, scaleLabel: { display: true, labelString: (dadosGraficos.yAxes != undefined ? dadosGraficos.yAxes : "")}, ticks: ticksOption }]
					})
				),
			// scales: { yAxes: [{ticks: ticksOption}] },
			/* opções de animação */
			animation: { onProgress: function(animation) { }, onComplete: function(animation) { }, duration: 1000, easing:'easeInQuad', },
			// title: { display: false, text: 'Gráfico', fontSize: 25, fullWidth: false, fontColor: "black", },
			responsive: (dadosGraficos.alturaGrafico != "auto" ? false : true),
			tooltips: dadosGraficos.tooltips == undefined ?
				{ model:'x', /* position: 'nearest', /* 'nearest', 'average' */ enabled: false, /* mode: 'index', */ intersect: false, custom: customTooltips, } : 
				{
					callbacks: {
						// Use the footer callback to display the sum of the items showing in the tooltip
						title: function(tooltipItems, data){return dadosGraficos.tooltips.titulo;},
						footer: (dadosGraficos.tooltips.rodape != undefined && dadosGraficos.tooltips.rodape != "" ? dadosGraficos.tooltips.rodape : function(tooltipItems, data) {return dadosGraficos.tooltips.rodape;}),
						/*footer: function(tooltipItems, data) {
							console.log("rodape");	
							console.log(dadosGraficos.tooltips.rodape);
							// var sum = 0; tooltipItems.forEach(function(tooltipItem) {sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];});
							// return 'Sum: ' + sum;
							return dadosGraficos.tooltips.rodape;
						},*/
						label: dadosGraficos.tooltips.texto, /*function(tooltipItem, data) {
							console.log(dadosGraficos.tooltips.label);
							console.log(data.datasets[tooltipItem.datasetIndex]);
							var label = data.datasets[tooltipItem.datasetIndex].label || '';
							// if (label) {label += ": Teste<br>";} // label += Math.round(tooltipItem.yLabel * 100) / 100;
							return label; // dadosGraficos.tooltips.label.replace(/:LABEL/g, label);
						}*/
					},
					mode: 'index',
					footerFontStyle: 'normal'
				},
			legend: { fontColor: 'red', display: (dadosGraficos.viewLegenda == undefined ? true : dadosGraficos.viewLegenda), 
				position: dadosGraficos.positionLegenda, 
				onHover: function(e, legendItem){}, 
				onClick: function(e, legendItem){
					if(dadosGraficos.boolClickLegand){
						/** Padrão click legenda */
						var index = legendItem.datasetIndex;
						var ci = this.chart;
						var meta = ci.getDatasetMeta(index);
						meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
						ci.update();
					}
					/** Oculta texto da caixa dos pontos nos graficos */
					setTimeout(function(){/*console.log("clickLegens");*/ clickDown_Global = false; $("#chartjs-tooltip").css('display', 'none');}, 200);
				}
			},
		}
	});
	$("#tipoGrafico").html(graficoSeledcionado);
	setarGrafico_Global = false;
	try{ $("#alertGrafico").hide(1000); } catch(erro){ /** Nada a fazer */ }
}

/** Faz a validação da paginação do gráfico é ativando quando muda nas setas ou no limite de qunatos listar numa só visualização */
function paginacao(option) { 
	option = $.extend({}, {div: "id_div", canvas: "myChart", indice: 0, op: '', divisao: 2, html:'', barraProgresso: 'barraProgresso'}, option);
	zerarPaginacao_Global = false;
	barraProgresso_Global = option.barraProgresso;
	var dadosTotal = dadosGraficos_Global[option.indice].dadosTotal[dadosGraficos_Global[option.indice].indiceDataSet].data.length;
	if(option.op == '+') {
		if((indicePag + parseInt(dadosGraficos_Global[option.indice].paginacao / option.divisao) + dadosGraficos_Global[option.indice].paginacao) < dadosTotal){
			indicePag += parseInt(dadosGraficos_Global[option.indice].paginacao / option.divisao);
		} else {
			indicePag = dadosTotal - dadosGraficos_Global[option.indice].paginacao;
		}
	}
	else if(option.op == '-') { 
		if(indicePag - parseInt(dadosGraficos_Global[option.indice].paginacao / option.divisao) >= 0) 	indicePag -= parseInt(dadosGraficos_Global[option.indice].paginacao / option.divisao);
		else 																							indicePag = 0;
	}
	else if((indicePag + dadosGraficos_Global[option.indice].paginacao) >= dadosTotal){
		indicePag = dadosTotal - dadosGraficos_Global[option.indice].paginacao;
	}
	option.descricao = dadosGraficos_Global[option.indice].titulo;
	if(!grafcioImpedido_Global) renderGrafico(option); // {}
	else alert("O grápfico está impedido");
	try{ $("#chartjs-tooltip")[0].style.display = 'none'; } catch(erro){} // esconder balanzinho dos graficos
}

/** Muda o limite da paginação podendo listar de 10 em 10 ou 15 em 15 */
function setPaginacao(option) { 
	option = $.extend({}, {div: "id_div", canvas: "myChart", indice: 0, op: '', valor: 10}, option);
	dadosGraficos_Global[option.indice].paginacao = parseInt(option.valor);
	paginacao(option);
}

function paginacaoY(option) { 
	option = $.extend({}, {div: "id_div", canvas: "myChart", indice: 0, op: ''}, option);
	// console.log(dadosGraficos_Global[option.indice].datasets);
	var datasets = dadosGraficos_Global[option.indice].datasets; // .length;
	var min =  dadosGraficos_Global[option.indice].min;
	var max =  dadosGraficos_Global[option.indice].max;
	var intervalMinMax = max - min;
	var maxData = 0, minData = 0;
	for (var i = 0; i < datasets.length; i++) {
		if(i == 0){
			maxData = datasets[i];
			minData = datasets[i];
		} else {
			if (minData > datasets[i]) {
				minData = datasets[i];
			}
			if (maxData < datasets[i]) {
				maxData = datasets[i];
			}
		}
	}

	/** tolerancia */
	var tolerancia = dadosGraficos_Global[option.indice].toleranciaRolagem != undefined ? dadosGraficos_Global[option.indice].toleranciaRolagem : 0; 
	var toleranciaPecr = tolerancia.indexOf('%') ? true : false;
	tolerancia = parseInt(tolerancia.replace('%', ''));
	var percentualTotal = (minData < 0 ? minData * (-1) : minData) + (maxData < 0 ? maxData * (-1) : maxData);
	if (toleranciaPecr) tolerancia = percentualTotal * tolerancia / 100;
	
	minData -= tolerancia;
	maxData += tolerancia;

	if(option.op == '+') {
		if(max + intervalMinMax > maxData){
			max = maxData;
			min = maxData - intervalMinMax;
		} else {
			max += intervalMinMax;
			min = max - intervalMinMax;
		}
	}
	else if(option.op == '-') { 
		if (min - intervalMinMax < minData) {
			min = minData
			max = minData + intervalMinMax;
		} else {
			min -= intervalMinMax;
			max = min + intervalMinMax;
		}
	}
	option.descricao = dadosGraficos_Global[option.indice].titulo;
	dadosGraficos_Global[option.indice].min = min;
	dadosGraficos_Global[option.indice].max = max;
	if(!grafcioImpedido_Global) renderGrafico(option); // {}
	else alert("O grápfico está impedido");
	try{ $("#chartjs-tooltip").css('display', 'none'); } catch(erro){ /** nada a fazer kkkkk */ }
}

/** Mostra o tamanho da tela no canto inferior esquerdo da tela */
// function setarTamanhoView(){ document.getElementById('tamanhoTela').innerHTML = window.innerWidth + "px X " + window.innerHeight + "px" ; }
// setarTamanhoView();
// window.addEventListener("resize", setarTamanhoView);

function formatarDataBr(data) { return data.split('-').reverse().join('/'); }

function ajax(option) { 
	option = $.extend({}, {url: "", param: {}, done: function(data){ console.log(data); } });
	if (option.url != "") {
		$.ajax({
			url: option.url,
			type: "POST",
			dataType: "text",
			data: option.param,
			error: function(){ alert("Falha ao fazer a requisição"); }
		}).done( option.done );
	}
}

/** usado nos quatro grafico de ocorrencia e de custo, ambos por obra e diagnostico */
function alertDataFiltroGraf() { 
	if(delayAlertDataFiltro){
		alert("Verfique a data do filtro");
		delayAlertDataFiltro = false;
		setTimeout( function(){
			delayAlertDataFiltro = true;
		}, 500);
	}
}

function desabilitarBotaoPaginacao(boolDesabilita) { 
	var btns = document.getElementsByName("btnPaginaGraf");
	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = boolDesabilita;
	}
}
/*
	click
	mouseover

	mousedown
	mousemove
	mouseup
	mouseleave

	resize (ativado toda vez que muda o tamanho da tela)
*/
