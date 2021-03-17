<?php

date_default_timezone_set('America/Sao_Paulo');

// Enviar o email para redefinir a senha
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function

// Load Composer's autoloader
require '../vendor/autoload.php';

include "funcoes.php";
$pdo = getConection();

if (is_file('./ClassSQL/classSQL.php')) include './ClassSQL/classSQL.php';

if (!empty($_POST['getConfigLogin'])) { 
	$config = json_decode(file_get_contents('../config.json'));
	if (!isset($config->login)) { 
		echo '{}';
	}
	$config->login->nome_projeto = $config->nome_projeto;

	if (isset($config->colorLoadAlert)) $config->login->colorLoadAlert = $config->colorLoadAlert;

	if (isset($config->cadastro)) { 
		$config->login->isCadastro = true;
		$config->login->linkCadastro = isset($config->cadastro->link) ? $config->cadastro->link : 'Cadastre-se';
	}

	if (isset($config->forget_password)) { 
		$config->login->isForgetPassword = true;
		$config->login->linkForgetPassword = isset($config->forget_password->link) ? $config->forget_password->link : 'Esqueceu Senha?';
	}

	if (!isset($config->login->logo_png) && isset($config->logo_png)) { 
		$config->login->logo_png = $config->logo_png;
	}

	echo json_encode($config->login);
}

if (!empty($_POST['getConfigCadastro'])) { 
	$config = json_decode(file_get_contents('../config.json'));
	if (!isset($config->cadastro)) { 
		echo '{}';
	}
	$config->cadastro->nome_projeto = $config->nome_projeto;

	if (isset($config->colorLoadAlert)) $config->cadastro->colorLoadAlert = $config->colorLoadAlert;

	if (isset($config->forget_password)) { 
		$config->cadastro->isForgetPassword = true;
		$config->cadastro->linkForgetPassword = isset($config->forget_password->link) ? $config->forget_password->link : 'Esqueceu Senha?';
	}

	$config->cadastro->linkLogin = isset($config->login->link) ? $config->login->link : 'Fazer Login';

	if (!isset($config->cadastro->logo_png) && isset($config->logo_png)) { 
		$config->cadastro->logo_png = $config->logo_png;
	}

	echo json_encode($config->cadastro);
}

if (!empty($_POST['getConfigForgetPassword'])) { 
	$config = json_decode(file_get_contents('../config.json'));
	if (!isset($config->forget_password)) { 
		echo '{}';
	}
	$config->forget_password->nome_projeto = $config->nome_projeto;

	if (isset($config->colorLoadAlert)) $config->forget_password->colorLoadAlert = $config->colorLoadAlert;

	if (isset($config->cadastro)) { 
		$config->forget_password->isCadastro = true;
		$config->forget_password->linkCadastro = isset($config->cadastro->link) ? $config->cadastro->link : 'Cadastre-se';
	}

	$config->forget_password->linkLogin = isset($config->login->link) ? $config->login->link : 'Fazer Login';

	if (!isset($config->forget_password->logo_png) && isset($config->logo_png)) { 
		$config->forget_password->logo_png = $config->logo_png;
	}

	echo json_encode($config->forget_password);
}

if (!empty($_POST['loginSystem']) && !empty($_POST['login']) && !empty($_POST['senha'])) { 
	// $login = strtoupper(preg_replace('/[^[:alpha:]_]/', '', $_POST['login']));
	// $senha = preg_replace('/[^[:alnum:]_]/', '', $_POST['senha']);
	// $login = preg_replace("/[a-zA-Z0-9_-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/", '', $_POST['login']);
	$login = preg_replace("/[^[a-zA-Z0-9-.+@]_]+/", '', $_POST['login']);
	$senha = preg_replace('/[^[:alnum:]_]/', '', $_POST['senha']);
	$senha = hash('sha224', $senha);
	$hashIdtentificacao = hash('sha224', date('YmdHis'));

	$sql = "SELECT 
				USUARIO.ID_USUARIO
				, USUARIO.NOME AS NOME
				, '$hashIdtentificacao' AS HASH
			FROM USUARIO
			WHERE USUARIO.EMAIL = '$login'
			AND USUARIO.SENHA = '$senha'";
	// printQuery(getQuery($pdo, $sql));
	// printQuery($sql);
	$usuario = padraoResultado($pdo, $sql, 'Nenhum resultado encontrado!');

	$usuario = $usuario[0];
	if ($usuario->get('debug') == 'OK') { 
		$id_usuario = $usuario->get('ID_USUARIO');
		$sql = "INSERT INTO USUARIO_HASH (ID_USUARIO, HASH) VALUES ($id_usuario,'$hashIdtentificacao')";
		padraoExecute($pdo, $sql, '');
		$usuario->set(null,'ID_USUARIO');
	}
	echo toJson(array($usuario));
}

if (!empty($_POST['passwordReset'])) { 
	$email = $_POST['email'];

	$sql = "SELECT 	USUARIO.ID_USUARIO
			, 		USUARIO.NOME
			FROM 	USUARIO
			WHERE 	USUARIO.EMAIL 		= '$email'
			AND 	USUARIO.CK_INATIVO 	= 0";
	// printQuery($sql);
	$usuario = padraoResultado($pdo, $sql, 'E-mail inválido!');
	$usuario = $usuario[0];

	if ($usuario->get('debug') != 'OK') { 
		echo toJson(array($usuario->get('debug')));
		return;
	}

	$configEnv = json_decode(file_get_contents('../config.env'));
	// Instantiation and passing `true` enables exceptions

	$id_usuario = $usuario->get('ID_USUARIO');
	$hashPasswordReset = hash('md5', $usuario->get('ID_USUARIO') . date('YmdHis'));

	$sql = "INSERT INTO SENHA_RESET (HASH, ID_USUARIO) VALUES ('$hashPasswordReset', $id_usuario);";
	// printQuery($sql);
	padraoExecute($pdo, $sql);

	// $_SERVER["HTTP_HOST"]; 				// "localhost" 
	// $_SERVER["REQUEST_SCHEME"]; 			// "http" 
	// $_SERVER["SCRIPT_FILENAME"]; 		// "E:/servidor/admin/controller/login.php" 
	// $_SERVER["DOCUMENT_ROOT"]; 			// "E:/servidor" 
	$link = $_SERVER["SCRIPT_FILENAME"]; // "E:/servidor/admin/controller/login.php" 
	$link = explode('/', $link);
	array_splice($link, sizeof($link)-2, 2);
	$link = implode('/', $link);
	// $_SERVER["REQUEST_SCHEME"] . '://' . $_SERVER["HTTP_HOST"] . ':' . $_SERVER["SERVER_PORT"], 
	$link = str_replace(
		$_SERVER["DOCUMENT_ROOT"], 
		$_SERVER["REQUEST_SCHEME"] . '://' . $_SERVER["HTTP_HOST"], 
		$link
	);
	$link .= '/password-change/?key=' . $hashPasswordReset;

	$body = require './template/password-reset.php';
	$body = str_replace('NOME_EMPRESA'				, $configEnv->password_reset__name			, $body);
	$body = str_replace('ENDERECO_EMPRESA'			, $configEnv->password_reset__endereco		, $body);
	$body = str_replace('SITE_EMPRESA'				, $configEnv->password_reset__site			, $body);
	$body = str_replace('EMAIL_CONTATO_EMPRESA'		, $configEnv->password_reset__emailContato	, $body);
	$body = str_replace('NOME_USUARIO'				, $usuario->get('NOME')						, $body);
	$body = str_replace('EMAIL_USUARIO'				, $email									, $body);
	$body = str_replace('LINK_REDEFINIR_SENHA'		, $link										, $body);

	$mail = new Email();
	$mail->host 		= $configEnv->password_reset__host;
	$mail->username 	= $configEnv->password_reset__email;
	$mail->password 	= $configEnv->password_reset__psw;
	$mail->isGmail 		= $configEnv->password_reset__isGmail;
	$mail->nameFrom 	= $configEnv->password_reset__name;
	$mail->emailAddress = $email;
	$mail->nameAddress 	= $usuario->get('NOME');
	$mail->subject 		= 'Confirmar alteração de senha do perfil ' . $usuario->get('NOME');
	$mail->body 		= $body;
	$mail->push(array( 'logo_ref' => '../img/logo.png' ), 'imgs');

	echo enviarEmail($mail);
}

if (!empty($_POST['passwordChange'])) { 
	if (empty($_POST['key']) || empty($_POST['senha'])) { 
		echo toJson(array(new FalseDebug('Informe os dados corretamente!')));
		return;
	}
	$key = $_POST['key'];
	$senha = $_POST['senha'];
	$senha = hash('sha224', $senha);

	$sql = "SELECT SENHA_RESET.ID_USUARIO
			FROM SENHA_RESET
			WHERE SENHA_RESET.HASH = '$key'
			AND SENHA_RESET.CK_INATIVO = 0";
	// printQuery($sql);
	$resultado = padraoResultado($pdo, $sql, 'Nenhum resultado encontrado!');
	$resultado = $resultado[0];
	if ($resultado->get('debug') != 'OK') { 
		echo toJson(array(new FalseDebug('Chave inválida!')));
		return;
	}

	$id_usuario = $resultado->get('ID_USUARIO');

	$sql = "UPDATE 	USUARIO
			SET 	USUARIO.SENHA = '$senha'
			WHERE 	USUARIO.ID_USUARIO = $id_usuario";
	// printQuery($sql);
	padraoExecute($pdo, $sql, '');

	$sql = "UPDATE 	SENHA_RESET
			SET 	SENHA_RESET.CK_INATIVO = 1
			WHERE 	SENHA_RESET.HASH = '$key'";
	// printQuery($sql);
	padraoExecute($pdo, $sql, '');

	echo toJson(array(new FalseDebug('OK')));
}

if (!empty($_POST['buscarCep'])) { 
	$cep = $_POST['cep'];
	echo file_get_contents("https://viacep.com.br/ws/$cep/json/");
}

if (is_file('../create-user/form.php')) include '../create-user/form.php';

?>