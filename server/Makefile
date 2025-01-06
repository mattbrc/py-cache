.PHONY: install run-api run-proxy

install:
	pip install -e .

run-api:
	uvicorn services_api.main:app --reload --port 8001

run-proxy:
	python proxy_cache/main.py 