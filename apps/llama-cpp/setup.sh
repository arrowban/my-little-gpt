#!/bin/bash

# if no .venv is found, create virtual environment
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

source .venv/bin/activate

pip install -r requirements.txt --upgrade --force-reinstall --no-cache-dir
CMAKE_ARGS="-DLLAMA_METAL=on" pip install llama-cpp-python --upgrade --force-reinstall --no-cache-dir
