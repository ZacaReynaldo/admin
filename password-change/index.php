<?php

include '../controller/funcoes.php';
$pdo = getConection();

$key = '';

if (isset($_GET['key'])) $key = $_GET['key'];

$sql = "SELECT 
			USUARIO.ID_USUARIO,
			USUARIO.NOME
		FROM SENHA_RESET
		INNER JOIN USUARIO ON USUARIO.ID_USUARIO = SENHA_RESET.ID_USUARIO
		WHERE SENHA_RESET.HASH = '$key'
		AND TIME_TO_SEC(TIMEDIFF(CURRENT_TIMESTAMP, SENHA_RESET.DT_SENHA_RESET)) <= 18000 -- 5 horas
		AND SENHA_RESET.CK_INATIVO = 0";
// printQuery($sql);
$resultado = padraoResultado($pdo, $sql, 'Nenhum resultado encontrado!');
$resultado = $resultado[0];

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title class="titulo_projeto">Carregando...</title>
	<link rel="shortcut icon" href="../img/favicon.ico" type="image/x-icon">
	<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<link rel="stylesheet" href="../biblioteca/bower_components/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="../biblioteca/bower_components/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="../biblioteca/bower_components/Ionicons/css/ionicons.min.css">
	<link rel="stylesheet" href="../biblioteca/bower_components/toast/jquery.toast.min.css">
	<link rel="stylesheet" href="../biblioteca/dist/css/AdminLTE.min.css">
	<link rel="stylesheet" href="../biblioteca/plugins/iCheck/square/blue.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
	<script>
		var ext = (window.location.href.split('.')[1] || '').split('?')[0].split('#')[0];
		if ((['html','php','htm']).indexOf(ext) != -1) { 
			var url = window.location.href.split('/');
			window.location.assign(url.splice(0,url.length-1).join('/'));
		}
	</script>
</head>
<body class="hold-transition login-page" style="height: auto;">
	<div class="login-box">
		<div class="login-logo">
			<div style="width: 100%;text-align: center;" class="text-center">
				<img src="" id="logoOficial" style="display:none;" alt="" width="100%">
			</div>
			<a href="#" class="titulo_projeto_login"></a>
		</div>
		<div class="text-center">
			<h3 class="tituloPagina"></h3>
		</div>
		<div class="login-box-body">

<?php 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ($resultado->get('debug') == 'OK') { 
	echo "
			<script>var key = '$key';</script>";
?>
			<script src="./form.js"></script>
			<div class="text-center">
				<p>Escolha uma nova senha para seu perfil <b><?php echo $resultado->get('NOME'); ?></b></p>
			</div>
			<div>
				<div class="row" id="formEmalPasswordChange"></div>
				<br>
				<div class="row">
					<div class="col-xs-7 linkAdicionais"></div>
					<div class="col-xs-5">
						<button onclick="passwordChange();" id="btnEnviar" class="btn btn-primary btn-block btn-flat">
							<i class="fa fa-check"></i>&nbsp;&nbsp;&nbsp;Redefinir
						</button>
					</div>
				</div>
			</div>
			<script>
				function resolvForm() { 
					$("#formEmalPasswordChange").html(resolvConfig(form_Global, 0, true));
				}

				function passwordChange() { 
					var form = getForm(form_Global);
					if (!form.valid) return;

					form.param.passwordChange = true;
					form.param.key = key;

					$("#btnEnviar").attr('disabled',true).find('i').attr('class','fa fa-spinner fa-pulse');

					$.ajax({ 
						url: '../controller/login.php'
						, type: 'POST'
						, dataType: 'text'
						, data: form.param
						, error: function() { 
							alert('Falha ao fazer a requisição!');
							$("#btnEnviar").attr('disabled',false).find('i').attr('class','fa fa-check');
						}
					}).done(function(data) { 
						console.log(data);
						data = JSON.parse(data);
						console.log(data);

						$("#btnEnviar").attr('disabled',false).find('i').attr('class','fa fa-check');

						if (data[0].debug == 'OK') { 
							alert('Senha alterado com sucesso!', { icon: 'success' });
							setTimeout(function() { 
								window.location.assign('../login');
							}, 2500);
						} else { 
							alert('Falha ao redefinir senha: ' + data[0].debug);
							try { $("#senha")[0].focus(); } catch(e) { }
						}
					});
				}
			</script>
<?php
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} else { 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
?>
			<div class="text-center">
				<h2>Link Expirado</h2>
			</div>
<?php
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
?>


		</div>
	</div>

	<script src="../biblioteca/bower_components/jquery/dist/jquery.min.js"></script>
	<script src="../biblioteca/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
	<script src="../biblioteca/plugins/iCheck/icheck.min.js"></script>
	<script src="../biblioteca/bower_components/jquery-mask/jquery.mask.min.js"></script>
	<script src="../biblioteca/bower_components/toast/jquery.toast.min.js"></script>
	<script src="../js/resolvConfig.full.js"></script>
	<script>
		$(function() { 
			$('input').iCheck({
				checkboxClass: 'icheckbox_square-blue',
				radioClass: 'iradio_square-blue',
				increaseArea: '20%' /* optional */
			});
		});

		var loaderBg_Global;
		$(document).ready(function() { 
			$.ajax({
				url: '../controller/login.php'
				, type: 'POST'
				, dataType: 'text'
				, data: { 'getConfigForgetPassword': true }
				, error: function() { 
					alert('Falha ao fazer a requisição!');
				}
			}).done(function(data) { 
				console.log(data);
				data = JSON.parse(data);
				console.log(data);

				if ((data.no_set_nome || '') == '') {
					$(".titulo_projeto_login").html((data.nome_projeto || ''));
				}
				$(".titulo_projeto").html((data.nome_projeto || ''));

				if ((data.email_maxlength || '') != '') $("#email").attr('maxlength', data.email_maxlength);

				if ((data.logo_png || '') != '') { 
					$("#logoOficial").attr('src','../img/' + data.logo_png + '.png').css('display','block');
				} else { 
					$("#logoOficial").css('display','none');
				}

				$(".tituloPagina").html(data.linkPasswordChange || "Redefinir Senha");
				$(".linkAdicionais").append('<div><a href="../login">' + data.linkLogin + '</a></div>');

				if ((data.isCadastro || '') != '') { 
					$(".linkAdicionais").append(''
						+ '<div><a href="../create-user">' + data.linkCadastro + '</a></div>'
					);
				}
				loaderBg_Global	= data.colorLoadAlert || '#11ACED';

				try { resolvForm(); } catch(e) { }
			});
		});

		var alertOld = alert;
		setTimeout(function() { 
			alert = function(text, options={}) { 
				try { 
					$.toast({ 
						heading: options.head || $(".titulo_pagina").html() || 'Aviso',
						text,
						showHideTransition: options.animation || 'slide',
						icon: options.icon || 'warning',
						position: options.position || "top-right",
						loaderBg: options.loaderBg || loaderBg_Global
					});
				} catch(e) { 
					console.error(e);
					alertOld(text);
				}
			}
		}, 500);
	</script>
</body>
</html>