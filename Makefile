
lib: $(shell find src -type f)
	mkdir -p lib
	cp -R src/* lib
	./node_modules/.bin/jison -o lib/Parser.js lib/facets.y
	./node_modules/.bin/tsc -p lib
    
.PHONY: clean
clean: 
	rm -R lib/*; 

.PHONY: dist
dist: 
	git push && npm publish

.PHONY: docs
docs: 
	rm -R docs; cd src && ../node_modules/.bin/typedoc --ignoreCompilerErrors \
	--mode modules --out docs . && mv docs .. \
	&& cd - && echo 'DO NOT DELETE!' > docs/.nojekyll

.PHONY: test
test:
	./node_modules/.bin/mocha --opts mocha.opts test/parse.ts
