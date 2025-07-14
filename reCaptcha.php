<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


 $token= $_GET['token'];

 $curl = curl_init();

 curl_setopt_array($curl, array(
     CURLOPT_URL => 'https://www.google.com/recaptcha/api/siteverify?response='.$token.'&secret=6LcFZgUqAAAAABOnjJqofXIiXbZD4q5Da5xxrr6a',
     CURLOPT_RETURNTRANSFER => true,
     CURLOPT_ENCODING => '',
     CURLOPT_MAXREDIRS => 10,
     CURLOPT_TIMEOUT => 0,
     CURLOPT_FOLLOWLOCATION => true,
     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
     CURLOPT_CUSTOMREQUEST => 'GET',
 ));

 $response = curl_exec($curl);

 curl_close($curl);

 


 $array_response = json_decode($response);


//  if($array_response->success==1){
//      $my_response = array(
//          'action_url' => 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
//          'success'=>true
//      );


//  }else{
//      $my_response = array(
//          'action_url' => '',
//          'success'=>false
//      );
//  }


 echo json_encode($array_response);

 die();

;?>