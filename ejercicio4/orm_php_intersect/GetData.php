<?php
/**
 * @OA\Info(title="My API", version="1.0")
 */
include_once 'ManageDB.php';

 /**
 * @OA\Get(
 *     path="/getdata",
 *     summary="Fetch data from the database",
 *     @OA\Response(
 *         response=200,
 *         description="Successful response",
 *         @OA\JsonContent(type="array", @OA\Items(type="object"))
 *     )
 * )
 */
 
header('Content-Type: application/json');

class GetData{
	public function getAll(){
    	$queries = new ManageBD();//tiene la conección a la bd
    	$queries_res = $queries->getQueries();//trae la query a la BD
		foreach($queries_res as $key => $res){
			$data[$key]=[];
    	while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
			$data[$key][]= $row;
		}
	   }
		return $data;
	 }
	}
	/*echo "<pre>";
	print_r($keys);
	echo "</pre>";*/
?>
