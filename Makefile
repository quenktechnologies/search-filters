
lib: $(shell find src -type f)
	rm -R lib || true
	mkdir -p lib
	cp -R src/* lib
	./node_modules/.bin/jison -o lib/parser/parser.js lib/parser/facets.y
	./node_modules/.bin/tsc -p lib

docs: src
	rm -R $@ || true
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--excludeExternals \
	--excludeNotExported \
	--excludePrivate \
	--tsconfig lib/tsconfig.json \
	--theme minimal 

