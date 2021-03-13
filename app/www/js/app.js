var resultDiv;

document.addEventListener("deviceready", init, false);
function init() { 
	document.querySelector("#scanChave").addEventListener("touchend", chaveScan, false);

	document.addEventListener("backbutton", function(e) { 
		e.preventDefault(), onBackKeyDown();
	}, false); 

	resultDiv = document.querySelector("#chaveNfe");

	var imprimir = false;
	cordova.plugins.printer.check(function (available, count) { 
		if (available) imprimir = true;
		// imprimirProNf(16);
		// imprimirProtocoloNf();
	});
}

function chaveScan() { 
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			/*var s = "Result: " + result.text + "<br/>" +
			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;*/
			if (result.text.length == 44) { 
				resultDiv.value = result.text;
				pesquisarEditar(resultDiv.value);
			} else if (result.text != "") { 
				alert('Código inválido!');
				chaveScan();
			}
		},
		function (error) { 
			alert("Falha ao Scannear: " + error);
		}
	);
}

function imprimirProtocoloNf() { 
	// var page = '<h1>Hello Document</h1>';
	// cordova.plugins.printer.print(page); //, 'Document.html'
}
