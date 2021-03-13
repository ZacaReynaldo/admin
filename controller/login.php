<?php

include "funcoes.php";
$pdo = getConection();

if (is_file('./ClassSQL/classSQL.php')) include './ClassSQL/classSQL.php';

if (!empty($_POST['getConfigLogin'])) { 
	$config = json_decode(file_get_contents('../config.json'));
	if (!isset($config->login)) { 
		echo '{}';
	}
	$config->login->nome_projeto = $config->nome_projeto;

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

if (!empty($_POST['login']) && !empty($_POST['senha'])) { 
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

if (!empty($_POST['email'])) { 
	$email = $_POST['email'];

	$sql = "SELECT 	NOME
			FROM 	USUARIO
			WHERE 	EMAIL 		= '$email'
			AND 	CK_INATIVO 	= 0";
	// printQuery($sql);
	$usuario = padraoResultado($pdo, $sql, 'E-mail inválido!');
	$usuario = $usuario[0];

	if ($usuario->get('debug') != 'OK') { 
		echo toJson(array($usuario->get('debug')));
		return;
	}

	// Enviar o email para redefinir a senha
	// Import PHPMailer classes into the global namespace
	// These must be at the top of your script, not inside a function
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	// Load Composer's autoloader
	require 'vendor/autoload.php';

	// Instantiation and passing `true` enables exceptions
	$mail = new PHPMailer(true);

	try { 
		// Server settings
		$mail->SMTPDebug 	= SMTP::DEBUG_SERVER; 						// Enable verbose debug output
		$mail->isSMTP(); 												// Send using SMTP
		$mail->Host 		= 'smtp.gmail.com'; 						// Set the SMTP server to send through
		$mail->SMTPAuth 	= true; 									// Enable SMTP authentication
		$mail->Username 	= 'email@gmail.com'; 						// SMTP username
		$mail->Password 	= 'senha'; 									// SMTP password
		// $mail->SMTPSecure 	= PHPMailer::ENCRYPTION_SMTPS; 			// Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
		// $mail->SMTPSecure 	= PHPMailer::ENCRYPTION_STARTTLS; 		// Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
		$mail->SMTPSecure 	= 'ssl';
		// $mail->Port 		= 587; 										// TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
		$mail->Port 		= 465; 										// SSL port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

		// Recipients
		$mail->setFrom('email@gmail.com', 'Emissor');
		$mail->addAddress('email@gmail.com', $usuario->get('NOME')); 	// Add a recipient
		// $mail->addAddress('ellen@example.com'); 						// Name is optional
		// $mail->addReplyTo('info@example.com', 'Information');
		// $mail->addCC('cc@example.com');
		// $mail->addBCC('bcc@example.com');

		// Attachments
		// $mail->addAttachment('/var/tmp/file.tar.gz'); 				// Add attachments
		// $mail->addAttachment('/tmp/image.jpg', 'new.jpg'); 			// Optional name

		// Content
		$mail->isHTML(true); 											// Set email format to HTML
		$mail->Subject 	= 'Here is the subject';
		$mail->Body 	= 'This is the HTML message body <b>in bold!</b>';
		$mail->AltBody 	= 'This is the body in plain text for non-HTML mail clients';

		$mail->send();
		echo 'Mensagem foi enviada com sucesso';
	} catch (Exception $e) { 
		echo "Falha ao enviar mensagem. Error: {$mail->ErrorInfo}";
	}
}

if (!empty($_POST['cep'])) { 
	$cep = $_POST['cep'];
	echo file_get_contents("https://viacep.com.br/ws/$cep/json/");
}

?>