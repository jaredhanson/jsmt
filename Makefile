SOURCES = bin/*.js lib/*.js lib/**/*.js

# ==============================================================================
# Node Tests
# ==============================================================================

MOCHA = ./node_modules/.bin/mocha

test:
	$(MOCHA) \
		--reporter spec \
		--require should \
		--bail

# ==============================================================================
# Static Analysis
# ==============================================================================

JSHINT = jshint

hint: lint
lint:
	$(JSHINT) $(SOURCES)


.PHONY: test hint lint
