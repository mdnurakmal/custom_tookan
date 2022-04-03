
start:
	git pull
	FILES=$(ps aux | grep 'app.js' | awk '{print $2}')
	sudo kill $(FILES)
	sudo forever start --require './tracing.js' app.js