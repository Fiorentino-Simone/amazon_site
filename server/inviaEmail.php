<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require 'composer/vendor/autoload.php';

    header('Content-Type: text/plain; charset=utf-8'); 

    $html = $_REQUEST["html"];
    
    $mail = new PHPMailer(TRUE);
    $mail->isSMTP();                                            
    $mail->SMTPDebug = 2; // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true; // authentication enabled
    $mail->Host = 'smtp.gmail.com';
    // Updated Settings
    $mail->SMTPSecure = 'ssl'; 
    $mail->Port = 465; 
    $mail->SMTPOptions = array(
        'ssl' => array(
        'verify_peer' => false,
        )
    );
    $mail->Username = "s.fiorentino.1743@vallauri.edu";
    $mail->Password = "Fiorentino08@";
    $mail->SetFrom("s.fiorentino.1743@vallauri.edu", "AMAZON");
    $mail->AddAddress($_REQUEST["email"], $_REQUEST["nome"]);

    //Content
    $mail->Subject = 'Acquisto completato';
    $mail->Body    = $html;
    $mail->IsHTML(true);

    if(!$mail->send()) {
        echo("Mailer Error: " . $mail->ErrorInfo);
    } else {
        http_response_code(200);
        $rs = json_encode("Message has been sent");
        echo($rs);
    }
?>