
MY_VAR := $(ps aux | grep 'app.js' | awk '{print $2}')
start:
	echo $(MY_VAR)
	sudo kill $(MY_VAR)
	sudo forever start --require './tracing.js' app.js