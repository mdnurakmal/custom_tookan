
MY_VAR := $(ps aux | grep 'app.js' | awk '{print $2}')
start:
	sudo kill $(MY_VAR)
	sudo forever start --require './tracing.js' app.js