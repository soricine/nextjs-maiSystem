<?php


require_once('./vendor/autoload.php');
use Postmark\PostmarkClient;

$client = new PostmarkClient("POSTMARK-SERVER-API-TOKEN-HERE");


$sendResult = $client->sendEmail(
  "sender@example.com",
  "recipient@example.com",
  "Hello from Postmark!",
  "This is just a friendly 'hello' from your friends at Postmark."
);

?>
