<?php
	$_POST = json_decode(file_get_contents("php://input"),true);	// только для json-файла
	echo var_dump($_POST);	// эта команда берёт данные, которые пришли на сервер, превращает их в строку и показывает нам обратно на клиенте
	////