
lib: $(shell find src -type f)
	rm -R lib || true
	mkdir -p lib
	cp -R src/* lib
	./node_modules/.bin/jison -o lib/parse/parser.js lib/parse/facets.y
	./node_modules/.bin/tsc -p lib

.PHONY: docs
docs:
	rm -R $@ || true
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--excludeExternals \
	--excludeNotExported \
	--excludePrivate \
	--tsconfig lib/tsconfig.json 

