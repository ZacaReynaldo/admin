
var base64Foto_Global 		= '', 
	extencaoFoto_Global 	= '', 
	cameraOn_Global 		= false;

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		try { 
			document.addEventListener('deviceready', this.onDeviceReady, false);
		} catch(e) { 
			alert('Falha no deviceready: ' + e)
		}
	},
	onDeviceReady: function() { 
		// try{ app.receivedEvent('deviceready'); 														} catch(error){}
		try{ document.querySelector("#scanFunc").addEventListener("touchend", funcScan, false); 	} catch(error){}
		try{ document.querySelector("#scanPatri").addEventListener("touchend", patriScan, false); 	} catch(error){}
		try{ document.querySelector("#cameraFoto").addEventListener("touchend", camera, false);		} catch(error){}
		try{ document.querySelector("#scanChave").addEventListener("touchend", chaveScan, false); 	} catch(error){}
		
		try{ document.querySelector("#prepare").addEventListener("touchend", prepareCamera, false); } catch(error){}
		try{ document.querySelector("#show").addEventListener("touchend", mostraCamera, false); 	} catch(error){}
		try{ document.querySelector("#hide").addEventListener("touchend", ocultarCamera, false); 	} catch(error){}
		try{ document.querySelector("#scan").addEventListener("touchend", scanearCamera, false); 	} catch(error){}
		try{ cameraLightStatus(); 																	} catch(error){}

		document.addEventListener("backbutton", function(e) { 
			e.preventDefault(), onBackKeyDown();
		}, false); 
		try { resultDiv = document.querySelector("#chaveNfe");										} catch(error){}
		var imprimir = false;
		cordova.plugins.printer.check(function (available, count) { 
			if (available) imprimir = true;
		});
	},
	receivedEvent: function(id) { 
		var push = PushNotification.init({ 
			android: {},
			ios: { 
				alert: "true",
				badge: true,
				sound: 'false'
			}
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
						error: function() { /* alert('Falha ao salvar registro app'); */ }
					}).done(function(data) { 
						console.log(data);
					});
				}
			} catch(error) { /*alert('error no ajax: ' + error);*/ }
		});

		push.on('notification', function (data) { 
			var notificacao = [];
			notificacao.push(data);
			if (localStorage.notificacao) { 
				var notificacoes = JSON.parse(localStorage.getItem('notificacao'));
				for (var i = 0; i < notificacoes.length; i++) notificacao.push(notificacoes[i]);
			}
			localStorage.setItem('notificacao', JSON.stringify(notificacao));

			if (noSistema_Global == undefined || !noSistema_Global) { 
				localStorage.setItem('pagina','notif');
				window.location.assign("blank.html");
			}
		});
	},
};

function onBackKeyDown() { 
	cameraLightStatus(true);
	if (cameraOn_Global) return ocultarCamera();

	if ($('#modalGenerico').is(':visible')) return $('#modalGenerico').modal('hide');

	if (paginaAtual_Global == 'main') { 
		if (confirm('Deseja sair do App?')) navigator.app.exitApp();
		return;
	}

	if (paginaAtual_Global == 'apontamento_producao_posto') 
		return abrirConteudo($(document.createElement('span')).attr('data-file','apontamento_producao'),'Apontamento Produção');

	if (paginaAtual_Global == 'apontamento_producao_item') 
		return abrirConteudo($(document.createElement('span')).attr('data-file','apontamento_producao_posto'),'Apontamento Produção');

	abrirConteudo($(document.createElement('span')).attr('data-file','main'),'Principal');
}

function camera() { 
	navigator.camera.getPicture(
		function(imageURI) { /* onSuccess, */ // imageData
			document.getElementById('divFotoCapiturada').style.display 	= 'block';
			var image = document.getElementById('fotoCapiturada');
			image.src = imageURI;

			setTimeout(function(){ 
				toDataURL( imageURI, function(dataUrl) { 
					var caracteres = dataUrl.length;
					extencaoFoto_Global = '';
					var ext = ['jpeg', 'jpg', 'png'];
					for (var i = 0; i < ext.length; i++) { 
						base64Foto_Global = dataUrl.replace('data:image/'+ext[i]+';base64,', '');
						if(caracteres > base64Foto_Global.length) extencaoFoto_Global = ext[i], i = ext.length;
					}
					setTimeout(function(){
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
	return encodedBase.replace("data:image\/png;base64,", "");
}

var callbackScanner = function(err, text) { 
	if (err) { 
		ocultarCamera();
		alert(err.name === 'SCAN_CANCELED' ? 'Cancelou a digitalização antes de encontrar um cóodigo.' : err._message);
	} else {
		alert(text);
		ocultarCamera();
	}
}

function ocultarCamera() { 
	window.QRScanner.hide(function(status){ console.log(status);});
	cameraOn_Global = false;
	$("#corpoPrincipal").css('display', 'block');
	$("#corpoPrincipalBody")[0].style.backgroundColor = 'white';
	$("#rodapeBtnCamera")[0].style.display = 'none';
	$("#telaLinhaCentral")[0].style.display = 'none';
}

function prepareCamera() { 
	try { 
		window.QRScanner.prepare(function (err, status){
			// alert('teste')
			if (err) {
				console.error(err);
			}
		});
		QRScanner.getStatus(function(status){
			if(status.prepared){
				document.getElementById('prepare').style.display = 'none';
				mostraCamera();
			} else { prepareCamera(); }
		});
	} catch(error) { 
		alert('Falha ao tentar prepar camera: ' + error);
	}
}

function funcScan(options={}) { 
	callbackScanner = function(err, text) { 
		if (err) { 
			ocultarCamera();
			alert(err.name === 'SCAN_CANCELED' ? 'Cancelou a digitalização antes de encontrar um código.' : err._message);
		} else { 
			if (typeof(options.done) == 'function') options.done(text);
			ocultarCamera();
		}
	}
	prepareCamera();
}

function mostraCamera() { 
	try { 
		QRScanner.getStatus(function(status) { 
			if (status.prepared) { 
				window.QRScanner.show();
				scanearCamera();
				cameraOn_Global = true;
				$("#corpoPrincipal").css('display', 'none'); // [0].style.display = 'none';
				$("#corpoPrincipalBody")[0].style.backgroundColor = 'transparent';
				$("#rodapeBtnCamera")[0].style.display = 'block';
				$("#telaLinhaCentral")[0].style.display = 'block';
			}
		});
	} catch(error) { 
		alert('falha ao mostrar camera');
	}
}

function scanearCamera() { 
	try { 
		window.QRScanner.scan(callbackScanner);
	} catch(errro) { 
		alert('falha ao tentar scannear!');
	}
}

function cameraLightStatus(disabledLight=false) { 
	QRScanner.getStatus(function(status) { 
		if (status.canEnableLight) { 
			document.getElementById('btnLightCamera').style.display = 'block';
			if (status.lightEnabled) { 
				if (disabledLight) { 
					window.QRScanner.disableLight(voidFunc()); 
					cameraLightStatus();
					return;
				}
				document.getElementById('imgCameraLight').src = '../img/flashbuttonon.png',
				document.getElementById('imgCameraLight').onclick = function() { 
					window.QRScanner.disableLight(voidFunc());
					cameraLightStatus();
				}
			} else { 
				document.getElementById('imgCameraLight').src = '../img/flashbuttonoff.png',
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

function voidFunc() { }
