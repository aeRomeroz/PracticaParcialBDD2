<?php
include_once 'DB.php';
class ManageBD extends DB{
  public function getQueries(){

	$course = $this->connect()->query('
	SELECT * FROM course
	');

	$takes = $this->connect()->query('
	SELECT * FROM takes
	');

	$total_credits = $this->connect()->query('

    SELECT DISTINCT SUM(credits) as sum FROM course c INNER JOIN takes t where c.course_id = t.course_id COLLATE utf8mb4_unicode_ci
	
	');

	
	$queries = array (
		"course"=>$course,
		"takes"=>$takes,
		"total_credits"=>$total_credits,
	);
	
	
		return $queries;
	
		
	}

}
?>