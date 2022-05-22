<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require 'composer/vendor/autoload.php';
    
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
    $mail->IsHTML(true);
    $mail->Username = "s.fiorentino.1743@vallauri.edu";
    $mail->Password = "Fiorentino08@";
    $mail->SetFrom("s.fiorentino.1743@vallauri.edu", "AMAZON");
    $mail->AddAddress("simo.fiorentino04@gmail.com");

    //Content
    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    if(!$mail->send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;
    } else {
        echo "Message has been sent";
    }
?>