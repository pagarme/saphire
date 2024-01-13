default: help

help: ## Get help
	@echo "Make tasks:\n"
	@grep -hE '^[%a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-17s\033[0m %s\n", $$1, $$2}'

npm-install: ## Npm install
	@npm install
