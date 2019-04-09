
lib: $(shell find src -type f)
	rm -R lib || true
	mkdir -p lib
	cp -R src/* lib
	./node_modules/.bin/jison -o lib/parser.js lib/facets.y
	./node_modules/.bin/tsc -p lib
