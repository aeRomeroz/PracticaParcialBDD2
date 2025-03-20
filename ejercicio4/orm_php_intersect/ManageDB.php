<?php
include_once 'DB.php';
class ManageBD extends DB{
  public function getQueries():array{

	$json = $this->connect()->query('SELECT m.object_mongodb FROM mongodb_objects m ');
	
	$queries = array (
		"json" => $json
	);
	
	
		return $queries;
	
		
	}

}
?>