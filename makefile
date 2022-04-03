SHELL = /bin/sh

start:
	ifeq (, $(SHELL which node))
	$(error "No node in $(PATH), consider doing apt-get install node")
	endif
	sudo chmod +x ./stop.sh
	./stop.sh
	sudo forever start --require './tracing.js' app.js