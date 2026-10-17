PORT ?= 8000
URL := http://127.0.0.1:$(PORT)/littlejs-games/overwrite/

# serve from ~/Desktop so ../../LittleJS (engine) resolves; Ctrl+C stops the server
run:
	(sleep 1; xdg-open $(URL)) &
	cd ../.. && python3 -m http.server $(PORT) --bind 127.0.0.1

.PHONY: run
