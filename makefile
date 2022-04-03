start:
	sudo kill $(ps aux | grep 'app.js' | awk '{print $2}')
	sudo forever start app.js