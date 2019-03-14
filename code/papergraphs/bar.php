<?php 
 if ($_GET['data']) {
  $size = strlen($_GET['data']);
  $valid = true;
  for ($x=0;$x<$size;$x++) {
   $c = $_GET['data'][$x];
   if (! ( ctype_digit($c) || ($c == ' ') || ($c == ",")) ) {
    $valid = false;
   }
  }
  if (!$valid) {
   header("Location: http://knolleary.net/paper-graphs");
  } else {
   $data = shell_exec("python bargen.py ".str_replace(","," ",$_GET['data']));
   if (strlen($data) > 0) {
    header("Content-Type: application/pdf");
    header("Content-Length: ".strlen($data));
    header('Content-Disposition: attachment; filename="bar.chart.v.1.'.md5($_GET['data']).'.pdf"');
    echo $data;
   } else {
    header("Location: http://knolleary.net/paper-graphs");
   }
  }
 } else {
  header("Location: http://knolleary.net/paper-graphs");
 }
?>
