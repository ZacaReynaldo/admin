
var app = {
	// Application Constructor
	initialize: function() { 
		this.bindEvents();
	},
	// Bind Event Listeners
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() { 
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() { 
		try{ app.receivedEvent('deviceready'); 														} catch(error){}
		try{ document.querySelector("#scanFunc").addEventListener("touchend", funcScan, false); 	} catch(error){}
		try{ document.querySelector("#scanPatri").addEventListener("touchend", patriScan, false); 	} catch(error){}
		try{ document.querySelector("#cameraFoto").addEventListener("touchend", camera, false);		} catch(error){}
		try{ document.querySelector("#scanChave").addEventListener("touchend", chaveScan, false); 	} catch(error){}

		try{ document.querySelector("#prepare").addEventListener("touchend", prepareCamera, false); } catch(error){}
		try{ document.querySelector("#show").addEventListener("touchend", mostraCamera, false); 	} catch(error){}
		try{ document.querySelector("#hide").addEventListener("touchend", ocultarCamera, false); 	} catch(error){}
		try{ document.querySelector("#scan").addEventListener("touchend", scanearCamera, false); 	} catch(error){}
		try{ cameraLightStatus(); 																	} catch(error){}

		document.addEventListener("backbutton", function(e){
			e.preventDefault(), onBackKeyDown();
		}, false); 
		// resultDiv = document.querySelector("#results");
		try { resultDiv = document.querySelector("#chaveNfe"); } catch(error){}
		var imprimir = false;
		cordova.plugins.printer.check(function (available, count) { 
			if (available) imprimir = true;
		});
	},
	receivedEvent: function(id) { 
		var push = PushNotification.init({
			android: {},
			ios: { alert: "true", badge: true, sound: 'false' }
		});
		push.on('registration', function(data) {
			console.log(data.registrationId);
			registroApp_Global = data.registrationId;
			console.log(data.registrationType);
			localStorage.setItem('registroPush', data.registrationId);
			try { 
				if (padraoParamReq_Global != undefined) { 
					$.ajax({
						url: caminhoRequisicao + "lb/controllerNotificacao.php",
						type: 'POST',
						dataType: 'text',
						data: $.extend({}, padraoParamReq_Global, {
							'registrar': true,
							'registro': data.registrationId
						}),
						error: function() { }
					}).done(function(data) { 
						console.log(data);
					});
				}
				// url: 'http://192.168.100.9:8088/push_plugin/admin/registrar.php',
				// $.ajax({
				// 	url: 'http://192.168.100.9:8088/push_plugin/admin/registrar.php',
				// 	type: 'POST',
				// 	dataType: 'text',
				// 	data:{
				// 		'op': 'regid',
				// 		'cmd': data.registrationId
				// 	},
				// 	error: function(error) { 
				// 	}
				// }).done(function(data) { 
				// });
			} catch(error) { }
		});

		push.on('notification', function(data) { 
			var notificacao = [];
			notificacao.push(data);
			if (localStorage.notificacao) { 
				var notificacoes = JSON.parse(localStorage.getItem('notificacao'));
				for (var i = 0; i < notificacoes.length; i++) notificacao.push(notificacoes[i]);
			}
			localStorage.setItem('notificacao', JSON.stringify(notificacao));
			/*
				var ul = document.getElementById("pushList");
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(data.message));
				ul.appendChild(li);
			*/
			// if (noSistema_Global == undefined || !noSistema_Global) window.location.assign("notif.html");
			if (noSistema_Global == undefined || !noSistema_Global) { 
				localStorage.setItem('pagina','notif');
				window.location.assign("blank.html");
			}
		});
	},
	// Update DOM on a Received Event
	/* receivedEvent: function(id) { 
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
	} */
};

var base64Foto_Global = '', extencaoFoto_Global = '';
function camera() { 
	navigator.camera.getPicture(
		function(imageURI) { 
			document.getElementById('divFotoCapiturada').style.display 	= 'block';
			var image = document.getElementById('fotoCapiturada');
			image.src = imageURI;

			setTimeout(function() { 
				toDataURL( imageURI, function(dataUrl) { 
					var caracteres = dataUrl.length;
					extencaoFoto_Global = '';
					var ext = ['jpeg', 'jpg', 'png'];
					for (var i = 0; i < ext.length; i++) { 
						base64Foto_Global = dataUrl.replace('data:image/'+ext[i]+';base64,', '');
						if (caracteres > base64Foto_Global.length) extencaoFoto_Global = ext[i], i = ext.length;
					}
					/* else {
						base64Foto_Global = dataUrl.replace('data:image/jpg;base64,', '');
						if(caracteres > base64Foto_Global.length) extencaoFoto_Global = 'jpg';
						else {
							base64Foto_Global = dataUrl.replace('data:image/png;base64,', '');
							if(caracteres > base64Foto_Global.length) extencaoFoto_Global = 'png';
						}
					} */
					setTimeout(function() { 
						document.getElementById('boolUpload').value = 1;
						uploadFoto();
					}, 200);
				});
			}, 200);
		}, 
		function(message) { /* onFail */
			limparFotoCapiturada();
			alert('Failed because: ' + message); 
		},{
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI
			// destinationType: Camera.DestinationType.DATA_URL
		}
	);
}

function toDataURL(url, callback) { 
	var xhr = new XMLHttpRequest();
	xhr.onload = function() { 
		var reader = new FileReader();
		reader.onloadend = function() { 
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}

function base64(img) { 
	var can = document.getElementById("imgCanvas");
	var ctx = can.getContext("2d");
		ctx.drawImage(img, 10, 10);
	var encodedBase = can.toDataURL();
	// return encodedBase.replace(/^data:image\/(png|jpg);base64,/, "");
	return encodedBase.replace("data:image\/png;base64,", "");
}

function funcScan() { 
	callbackScanner = function(err, text) { 
		if (err) { 
			ocultarCamera();
			alert(err.name === 'SCAN_CANCELED' ? 'Cancelou a digitalização antes de encontrar um cóodigo.' : err._message);
		} else { 
			if(text != '') buscarSetarFuncionario(text);
			ocultarCamera();
		}
	}
	prepareCamera();
	/* cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(result.text != '') buscarSetarFuncionario(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		},
		{
			showFlipCameraButton : true, // iOS and Android
			showTorchButton : true, // iOS and Android
			torchOn: false, // Android, launch with the torch switched on (if available)
			// saveHistory: true, // Android, save scan history (default false)
			prompt : "Por favor um código de barras dentro da área de leitura", // Android
			// resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
			// formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
			orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
			// disableAnimations : true, // iOS
			disableSuccessBeep: true // iOS and Android
		}
	); */
}

function buscarSetarFuncionario(cod) { 
	var param = { 'buscaFuncionario': true, cod	};

	$.ajax({
		url: caminhoRequisicao + "lb/controllerMovAlmoxarifado.php",
		type: 'POST',
		dataType: 'text',
		data: $.extend({}, padraoParamReq_Global, param),
		error: function(){ alert("Falha ao tentar pesquisar Funcionario"); }
	}).done(function(data) { 
		console.log(data);
		data = JSON.parse(data);
		console.log(data);
		$("#setarAlmoxarifado")[0].onclick = data.COD_FOLHA_FUNC == "00000-0" 
			? function(){} 
			: function(){ buscarSetarFuncionario('00000-0'); };

		if (['1','0','OK'].indexOf(String(data.debug)) < 0) return alert(data.debug);

		$("#id_folha_func").val(data.ID_FOLHA_FUNC);
		$("#ds_folha_func").val(data.NM_FOLHA_FUNC);
	});
}

function patriScan() {
	callbackScanner = function(err, text) { 
		if (err) { 
			ocultarCamera();
			alert(err.name === 'SCAN_CANCELED' ? 'Cancelou a digitalização antes de encontrar um cóodigo.' : err._message);
		} else { 
			if (text != '') buscaSetarPatrimonio(text);
			ocultarCamera();
		}
	}
	prepareCamera();
	/* cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(result.text != '') buscaSetarPatrimonio(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	); */
}

function buscaSetarPatrimonio(cod) { 
	$.ajax({
		url: caminhoRequisicao + "lb/controllerMovAlmoxarifado.php",
		type: 'POST',
		dataType: 'text',
		data: $.extend({}, padraoParamReq_Global, {
			'buscarFerramenta': true, cod
		}),
		error: function(){ alert("Falha ao tentar pesquisar Ferramenta"); }
	}).done(function(data) { 
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		if (['1','0','OK'].indexOf(String(data.debug)) < 0) return alert(data.debug);

		$("#ds_patrimonio").val(data.DS_PATRIMONIO);
		$("#id_patrimonio").val(data.ID_PATRIMONIO);
		$("#id_patrimonio_aluguel").val(data.ID_PATRIMONIO_ALUGUEL);
	});
}

function chaveScan() { 
	callbackScanner = function(err, text) { 
		if (err) { 
			ocultarCamera();
			alert(err.name === 'SCAN_CANCELED' ? 'Cancelou a digitalização antes de encontrar um cóodigo.' : err._message);
		} else { 
			if (text.length == 44) { 
				resultDiv.value = text;
				pesquisarEditar(resultDiv.value);
			} else if(text != "") { 
				alert('Código inválido!');
				chaveScan();
			}
			ocultarCamera();
		}
	}
	prepareCamera();
	/* cordova.plugins.barcodeScanner.scan(
		function (result) {
			if (result.text.length == 44) { 
				resultDiv.value = result.text;
				pesquisarEditar(resultDiv.value);
			} else if(result.text != ""){
				alert('Código inválido!');
				chaveScan();
			}
		},
		function (error) {
			alert("Falha ao Scannear: " + error);
		}
	);*/
}

function prepareCamera() { 
	try { 
		window.QRScanner.prepare(function (err, status) { 
			if (err) console.error(err);
			// if (status.authorized) { } else if (status.denied) { } else { }
		});
		QRScanner.getStatus(function(status) { 
			if (status.prepared) { 
				document.getElementById('prepare').style.display = 'none';
				mostraCamera();
			} else { 
				prepareCamera();
			}
		});
	} catch(error) { 
		alert('falha ao tentar prepar camera');
	}
}

function mostraCamera() { 
	try { 
		QRScanner.getStatus(function(status) { 
			if (status.prepared) { 
				window.QRScanner.show();
				scanearCamera();
				// try{ screen.orientation.lock('landscape'); } catch(error){}
				cameraOn_Global = true;
				$("#corpoPrincipal").css('display', 'none'); // [0].style.display = 'none';
				$("#corpoPrincipalBody")[0].style.backgroundColor = 'transparent';
				$("#rodapeBtnCamera")[0].style.display = 'block';
				$("#telaLinhaCentral")[0].style.display = 'block';
			}
		});
	} catch(e) { 
		alert('falha ao mostrar camera');
	}
}

function ocultarCamera() { 
	window.QRScanner.hide(function(status){ console.log(status);});
	cameraOn_Global = true;
	// try{ screen.orientation.lock('portrait'); 	} catch(error){}
	// try{ screen.orientation.unlock();			} catch(error){}
	$("#corpoPrincipal").css('display', 'block');
	$("#corpoPrincipalBody")[0].style.backgroundColor = 'white';
	$("#rodapeBtnCamera")[0].style.display = 'none';
	$("#telaLinhaCentral")[0].style.display = 'none';
}

function scanearCamera() { 
	try { 
		window.QRScanner.scan(callbackScanner);
	} catch(e) { 
		alert('falha ao tentar scannear!');
	}
}

var callbackScanner = function(err, text) { 
	ocultarCamera();
	alert(!err ? text : ''
		+ (err.name === 'SCAN_CANCELED' ? 'Cancelou a digitalização antes de encontrar um cóodigo.' : err._message)
	);
}

function cameraLightStatus() { 
	QRScanner.getStatus(function(status) { 
		if (status.canEnableLight) { 
			document.getElementById('btnLightCamera').style.display = 'block';
			if (status.lightEnabled) { 
				document.getElementById('imgCameraLight').src = 'img/flashbuttonon.png',
				document.getElementById('imgCameraLight').onclick = function() { 
					window.QRScanner.disableLight(voidFunc());
					cameraLightStatus();
				}
			} else { 
				document.getElementById('imgCameraLight').src = 'img/flashbuttonoff.png',
				document.getElementById('imgCameraLight').onclick = function() { 
					window.QRScanner.enableLight(voidFunc());
					cameraLightStatus();
				}
			}
		} else { 
			document.getElementById('btnLightCamera').style.display = 'none';
		}
	});
}

function voidFunc(){}
