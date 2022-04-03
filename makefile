

start:
	./stop.sh
	sudo forever start --require './tracing.js' app.js